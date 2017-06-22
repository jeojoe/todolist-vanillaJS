//===== Class ======//

// List class for storing data
function List(id, text) {
  this.text = text;
  this.id = id;
  this.created_at = new Date();
  this.isDone = false;
}
// App's Storage, contains all states and logics
function Storage() {
  this.lists = [];
  this.id = 0;
  this.filter = 'all'; // all, active, done
  this.addList = function(text) {
    const newList = new List(this.id, text);
    this.lists.push(newList);
    this.id++;
    // change states then just render
    render();
  }
  this.removeList = function(id) {
    for (i in this.lists) {
      if (this.lists[i].id === id) {
        this.lists.splice(i, 1);
        break;
      }
    }
    // change states then just render
    render();
  }
  this.toggleList = function(id) {
    for (i in this.lists) {
      if (this.lists[i].id === id) {
        this.lists[i].isDone = !this.lists[i].isDone;
        break;
      }
    }
    // change states then just render
    render();
  }
  this.changeFilter = function(filter) {
    this.filter = filter;
    // change states then just render
    render();
  }
  this.clearDone = function() {
    console.log('sdfsdf');
    const notDoneLists = this.lists.filter(list => !list.isDone);
    console.log(notDoneLists);
    this.lists = notDoneLists;
    // change states then just render
    render();
  }
}

//===== Initialize App =======//

// Init app's storage then test adding list.
let store = new Storage();
store.addList('Hello there, this is first list for you.');

// Attach addList function to input's onkeypress event
let textField = document.getElementById('main-input');
textField.onkeypress = function(e) {
  let key = e.keyCode || e.which;
  if (key === 13) {
    if (!textField.value.trim()) return;
    store.addList(textField.value);
    textField.value = '';
  }
}

// Attach changeFilter function to filter button's onclick event
let allFilter = document.getElementById('all-filter');
let activeFilter = document.getElementById('active-filter');
let doneFilter = document.getElementById('done-filter');

allFilter.onclick = function() {
  store.changeFilter('all');
  allFilter.classList.add('button-primary');
  activeFilter.classList.remove('button-primary');
  doneFilter.classList.remove('button-primary');
}
activeFilter.onclick = function() {
  store.changeFilter('active');
  allFilter.classList.remove('button-primary');
  activeFilter.classList.add('button-primary');
  doneFilter.classList.remove('button-primary');
}
doneFilter.onclick = function() {
  store.changeFilter('done');
  allFilter.classList.remove('button-primary');
  activeFilter.classList.remove('button-primary');
  doneFilter.classList.add('button-primary');
}

// Attach clearDone function to clear done button
let clearBtn = document.getElementById('clear-btn');
clearBtn.onclick = function() {
  store.clearDone();
}

//===== Rendering DOM ======//

// After updating states, storage will re-render DOM by calling this function.
function render() {
  // Clear all children
  document.getElementById('list-wrapper').innerHTML = null;
  // Counting for seq. number and incomplete lists.
  let seq = 1;
  let countLeft = 0;

  // Render all lists and also attach toggleList and deleteList function.
  for (i in store.lists) {
    const list = store.lists[i];
    
    // If list isn't done yet, countLeft++
    if (!list.isDone) countLeft++;

    // Filter logics
    // Active filter but list is done -> skip
    if (store.filter === 'active' && list.isDone) continue;
    // Done filter but list isn't done -> skip
    else if (store.filter === 'done' && !list.isDone) continue;

    /* List DOM Structure 
      - listDOM
        - seqDOM
        - checkmarkDOM
        - textDOM
        - deleteButtonDOM
    */
    const listDOM = document.createElement('div');
    listDOM.classList.add('list');
    if (list.isDone) {
      listDOM.classList.add('done');
    }
    listDOM.onclick = function() {
      store.toggleList(list.id);
    };

    const seqDOM = document.createElement('div');
    seqDOM.classList.add('seq');
    seqDOM.innerHTML = seq++;

    const checkmarkDOM = document.createElement('div');
    checkmarkDOM.classList.add('checkmark');

    const textDOM = document.createElement('div');
    textDOM.classList.add('text');
    textDOM.innerHTML = list.text;

    const deleteButtonDOM = document.createElement('i');
    deleteButtonDOM.classList.add('delete-button', 'fa', 'fa-times-rectangle');
    deleteButtonDOM.onclick = function() {
      console.log('remove')
      store.removeList(list.id);
    };

    // Glue DOM together
    listDOM.appendChild(seqDOM);
    listDOM.appendChild(checkmarkDOM);
    listDOM.appendChild(textDOM);
    listDOM.appendChild(deleteButtonDOM);
    document.getElementById('list-wrapper').appendChild(listDOM);
  }

  // Render count label e.g. "You have 7 todos!"
  const countDOM = document.createElement('div');
  countDOM.classList.add('left');
  if (countLeft > 0) {
    countDOM.innerHTML = 'You have ' + countLeft + (countLeft > 1 ? ' todos ' : ' todo ')  + 'left !';  
  } else {
    countDOM.classList.add('done');
    countDOM.innerHTML = 'Everthing is done! Time to GO HOME !';
  }
  document.getElementById('list-wrapper').appendChild(countDOM);
}