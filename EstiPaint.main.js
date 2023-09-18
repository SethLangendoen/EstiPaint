 /* ------------------------- General Variables ------------------------- */ 

const parentDiv = document.getElementById('mainPage');
parentDiv.classList.add('pDiv');
/* ------------------------------------- The drag and drop functionality ----------------------------------- */
 
//  Function to handle the drag-and-drop functionality
// Function to handle the vertical drag-and-drop functionality
function enableDragAndDrop() {
  const container = document.getElementById('mainPage');
  const items = Array.from(container.querySelectorAll('.draggable-item'));
  let activeItem = null;

  items.forEach((item) => {
    item.addEventListener('mousedown', (e) => {
      activeItem = item;
      item.style.zIndex = '1';
      const startY = e.clientY - item.getBoundingClientRect().top;

      function onMouseMove(e) {
        const mouseY = e.clientY;
        const newY = mouseY - startY;

        // Prevent items from overlapping
        const itemAbove = items.find((otherItem) => {
          return otherItem !== activeItem &&
            newY < otherItem.getBoundingClientRect().bottom &&
            newY + activeItem.clientHeight > otherItem.getBoundingClientRect().top;
        });

        if (itemAbove) {
          const itemAboveIndex = items.indexOf(itemAbove);
          container.insertBefore(activeItem, itemAbove);
          items.splice(items.indexOf(activeItem), 1);
          items.splice(itemAboveIndex, 0, activeItem);
        } else {
          item.style.transform = `translateY(${newY}px)`;
        }
      }

      function onMouseUp() {
        activeItem.style.zIndex = '0';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        activeItem = null;
        updatePositions();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });

  function updatePositions() {
    items.forEach((item, index) => {
      item.style.transform = `translateY(${index * item.clientHeight}px)`;
    });
  }
}





 /* ------------------------- So that the preset focus goes down one when I click enter ------------------------- */ 

  const inputs = document.querySelectorAll('#presets input[type="text"]');


  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const nextIndex = i + 1;
        if (nextIndex < inputs.length) {
          inputs[nextIndex].focus();
        }
      }
    });
  }


  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('keydown', function (event) {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (inputs[i].value.trim() === '') {
          event.preventDefault();
          const previousIndex = i - 1;
          if (previousIndex >= 0) {
            inputs[previousIndex].focus();
          }
        }
      }
    });
  }


 /* ------------------------- Create a back button in case the user accidentally deletes the wrong item.  ------------------------- */ 

 /* ------------------------- this is the content for the delete button ------------------------- */ 

const deleteButton = document.getElementById('deleteButton'); 
const mainPageChildren = parentDiv.children; // gets all of the children from the main script. 
let delButtonColourGreen = true; 


// Array to store the event listener functions
const eventListeners = [];

deleteButton.addEventListener('click', function() {
  if (delButtonColourGreen) {
    deleteButton.style.backgroundColor = 'red';
    delButtonColourGreen = false;
    //enableDragAndDrop();



    // this makes use of IIFE's. The function is immediately invoked with each loop. The 'child' is the child of the mainPageChildren at i. 
    // This essentially gives listeners to every single child in the main Page. 
    for (var i = 0; i < mainPageChildren.length; i++) {
      (function(child) {
        const mouseoverListener = function() {
          child.style.backgroundColor = 'red';
        };
        const mouseoutListener = function() {

          // We do not wish for titles or subtitles to become grey. But rather remain white:
          if (child.classList.contains('addTitle') || child.classList.contains('addSubtitle')){
            child.style.backgroundColor = 'rgb(240, 240, 240)';
          } else {
            child.style.backgroundColor = 'rgb(192, 192, 192)';
          }
        };
        const clickListener = function() {
          child.remove(); 
        };

        child.addEventListener('mouseover', mouseoverListener);
        child.addEventListener('mouseout', mouseoutListener);
        child.addEventListener('click', clickListener);

        // Store the event listener functions in the separate array
        eventListeners.push({
          child,
          mouseoverListener,
          mouseoutListener,
          clickListener
        });
      })(mainPageChildren[i]);
    }
    // for removing the event listeners. 
  } else {
    deleteButton.style.backgroundColor = '#4CAF50';
    delButtonColourGreen = true;

    // Remove the event listeners from the child elements
    for (const eventListener of eventListeners) {
      const { child, mouseoverListener, mouseoutListener, clickListener } = eventListener;
      child.removeEventListener('mouseover', mouseoverListener);
      child.removeEventListener('mouseout', mouseoutListener);
      child.removeEventListener('click', clickListener);
    }

    // Clear the event listener array
    eventListeners.length = 0;
  }
});

  
 
 /* ------------------------- this is the content for the addTitle button ------------------------- */ 

 const addTitleButton = document.getElementById('addTitleButton');

 addTitleButton.addEventListener('click', function() {
    //enableDragAndDrop();

    const newTitle = document.createElement('input');
    newTitle.classList.add('draggable-item'); 
    newTitle.setAttribute('type', 'text'); 
    newTitle.setAttribute('placeholder', 'Enter the title here');
    newTitle.classList.add('addTitle');
    parentDiv.appendChild(newTitle);

});

 /* ------------------------- this is the content for the addSubTitle button ------------------------- */ 

 const addSubtitleButton = document.getElementById('addSubtitleButton');

 addSubtitleButton.addEventListener('click', function() {
    //enableDragAndDrop();

    const newSubtitle = document.createElement('input');
    newSubtitle.classList.add('draggable-item'); 

    newSubtitle.setAttribute('type', 'text'); 
    newSubtitle.setAttribute('placeholder', 'Enter the subtitle here');
    newSubtitle.classList.add('addSubtitle');
    parentDiv.appendChild(newSubtitle);

});

/* ------------------------- this is the content for the add room item button ----------------------------------------------------- */ 

const addButton = document.getElementById('addButton');
const wallRate = document.getElementById('wallRate');
const baseboardRate = document.getElementById('baseboardRate'); 
const ceilingRate = document.getElementById('ceilingRate');
const wallEfficiency = document.getElementById('wallEfficiency');
const baseboardEfficiency = document.getElementById('baseboardEfficiency'); 
const ceilingEfficiency = document.getElementById('ceilingEfficiency');

var colourList = document.createElement('datalist'); 
colourList.setAttribute('id','colourDataList'); 
document.body.appendChild(colourList);



// Add event listener to the button
addButton.addEventListener('click', function() {
  //enableDragAndDrop();

  
  // Create a new div element
  const newDiv = document.createElement('div');
  newDiv.classList.add('draggable-item'); 



  // Create a div that will hold both the room title and the calculate button. Style them to align horizontally. 

  // Create the elements that will go into the new item div

  const divHoldingTitleAndButton = document.createElement('div'); 
  const newTitle = document.createElement('input');

  const calculateButton = document.createElement('button'); 
  const newAdditionalComments = document.createElement('textarea');
  const roomDimensions = document.createElement('p');

  calculateButton.classList.add('calculateRoomDimensionsButton')
  divHoldingTitleAndButton.style.display = 'flex';
  divHoldingTitleAndButton.style.justifyContent = 'space-between'; // or 'flex-end' for rightmost alignment

  divHoldingTitleAndButton.appendChild(newTitle); 
  divHoldingTitleAndButton.appendChild(calculateButton); 

  calculateButton.textContent = 'calculate'; 



  // Customize the new div with content and styling
  newDiv.classList.add('newDivClass'); // assigns a class to the newItems div.
  newTitle.classList.add('newTitleClass');
  newTitle.setAttribute('id','newRoomTitle');
  newAdditionalComments.classList.add('newAdditionalCommentsClass');

  roomDimensions.classList.add('roomDimensions'); 
  

  // Customize the input elements
  newTitle.setAttribute('type', 'text');
  newTitle.setAttribute('placeholder', 'Enter the title here');
  newAdditionalComments.setAttribute('placeholder', 'Enter additional comments here');
  newAdditionalComments.setAttribute('id', 'newRoomAdditionalComments');

  roomDimensions.textContent = "Dimensions";



    // Create the table element
    const table = document.createElement('table'); // this is a table for the table headings. 
    const roomDimensionTable = document.createElement('table');
    roomDimensionTable.setAttribute('class','roomDimensionTable'); 

    // creating the header for each table. 
    const row = document.createElement('tr');
    // const h1 = document.createElement('th');
    // h1.textContent = "Needs Painting";
    // row.appendChild(h1); 
    const h2 = document.createElement('th');
    h2.textContent = "Item";
    row.appendChild(h2); 
    const h3 = document.createElement('th'); 
    h3.textContent = "Paint Coats";
    row.appendChild(h3); 
    const h4 = document.createElement('th'); 
    h4.textContent = "Primer Coats";
    row.appendChild(h4); 
    const h5 = document.createElement('th'); 
    h5.textContent = "Colour";
    row.appendChild(h5); 
    const h6 = document.createElement('th'); 
    h6.textContent = "Primer";
    row.appendChild(h6); 

    table.appendChild(row); 

    table.classList.add('myTable'); 

    const roomDimensionData = [
        {title: "Room width"},
        {title: "Room length"},
        {title: "Room height"},
        {title: "Room perimeter"},
        {title: "Baseboard perimeter"},
        {title: "Baseboard height"}
    ];


    const beingCalculated = ["Ceiling calculation: ","Wall calculation: " ,"Baseboard calculation: "]; 

    const numRows = Math.ceil(roomDimensionData.length / 2); // Calculate the number of rows needed

    for (let i = 0; i < numRows; i++) {
      const row = document.createElement('tr');
      
      // Title cell
      const title = document.createElement('td');
      title.setAttribute('class','titlesBeingCalculated');
      title.textContent = beingCalculated[i];
      row.appendChild(title);
    
      for (let j = 0; j < 2; j++) {
        const dataIndex = i * 2 + j; // Calculate the index of the current data item
    
        if (dataIndex < roomDimensionData.length) {
          const data = roomDimensionData[dataIndex];


          // Title cell
          const titleCell = document.createElement('td');
          titleCell.setAttribute('class','calculatedDimensionTable'); 
          titleCell.textContent = data.title;
          row.appendChild(titleCell);
    
          // Input cell
          const inputCell = document.createElement('td');
          const sizeInputBox = document.createElement('input');
          sizeInputBox.setAttribute('type', 'text');
          sizeInputBox.setAttribute('placeholder', 'lnft');
          sizeInputBox.setAttribute('class', 'size');
          inputCell.appendChild(sizeInputBox);
          row.appendChild(inputCell);
        } else {
          // Empty cells for remaining columns
          const emptyCell = document.createElement('td');
          emptyCell.textContent = ''; // You can set any desired content or style for empty cells
          row.appendChild(emptyCell);
        }
      }
    
      roomDimensionTable.appendChild(row);
    }

    

const tableData = [
    { title: 'Walls', id: 'walls' },
    { title: 'Ceilings', id: 'ceilings' },
    { title: 'Baseboards', id: 'baseboards' }
  ];
  
  // Loop through the table data to create rows
    tableData.forEach(data => {
    const row = document.createElement('tr');
  
    // Create checkbox cell
    // const checkboxCell = document.createElement('td');
    // const checkbox = document.createElement('input');
    // checkbox.setAttribute('type', 'checkbox');
    // checkbox.setAttribute('id', data.id);
    // checkboxCell.appendChild(checkbox);
    // row.appendChild(checkboxCell);
  
    // Create title cell
    const titleCell = document.createElement('td');
    titleCell.textContent = data.title;
    row.appendChild(titleCell);

    // Create number of coats input cell
    const coatsCell = document.createElement('td');
    const coatsInput = document.createElement('input');
    coatsInput.setAttribute("class","coatsCellItem")
    coatsInput.setAttribute('type', 'number');
    coatsInput.value = 0; 
    //coatsInput.setAttribute('placeholder', 'Enter number of coats');
    coatsCell.appendChild(coatsInput);
    row.appendChild(coatsCell);

    // primer coat cells
    const primerCoatsCell = document.createElement('td');
    const primerCoatsInput = document.createElement('input');
    primerCoatsInput.setAttribute("class","primerCoatsCellItem")
    primerCoatsInput.setAttribute('type', 'number');
    primerCoatsInput.value = 0; 
    primerCoatsCell.appendChild(primerCoatsInput);
    row.appendChild(primerCoatsCell); 

    // colour input box cells
    const colourCell = document.createElement('td');
    const colourInput = document.createElement('input');
    colourInput.classList.add("colourInput"); 
    colourInput.classList.add("colours"); // Add the new class
    colourInput.setAttribute('list', 'colourDataList'); 


    colourInput.setAttribute('type', 'text');
    colourCell.appendChild(colourInput);
    row.appendChild(colourCell); 

    // primer input box cells
    const primerCell = document.createElement('td');
    const primerInput = document.createElement('input');
    primerInput.classList.add("colourInput");
    primerInput.classList.add("primers");
  
    primerInput.setAttribute('list', 'colourDataList'); 


    primerInput.setAttribute('type', 'text');
    primerCell.appendChild(primerInput);
    row.appendChild(primerCell); 

    table.appendChild(row);
    });




// The portion below deals with assigning values to 

// Get all the color boxes as an array 
var colorBoxes = document.getElementsByClassName('colourInput');

Array.from(colorBoxes).forEach(function(colorBox) {
  colorBox.addEventListener('blur', function() {
    updateColourList();
  });
});

function updateColourList() {
  // Clear the existing options in the datalist
  colourList.innerHTML = '';

  // Iterate over all colorBoxes and add options with non-empty values to the datalist
  Array.from(colorBoxes).forEach(function(colorBox) {
    if (colorBox.value.trim() !== '') {
      // Check if the value already exists in the datalist
      var exists = Array.from(colourList.options).some(function(option) {
        // the function will return without adding the value to the list if these two statements are identical. 
        return option.value.toLowerCase() === colorBox.value.toLowerCase(); 
      });
      // If the phrase inside of the box is not found in the stored list, then we add that phrase to the list. 
      if (!exists) {
        // Create a new option element
        var newOption = document.createElement('option');
        newOption.setAttribute('value', colorBox.value);

        // Append the new option to the datalist
        colourList.appendChild(newOption);
      }
    }
  });
}



  const rooomDimensionTableDiv = document.createElement('div');
  const calculatedRoomDimensionTable = document.createElement('table');
  calculatedRoomDimensionTable.setAttribute('class','calculatedRoomDimensionTable');

  const calculatedRoomDimension = [
     { title: "Walls" },
     { title: "Ceilings" },
     { title: "Baseboards" }
   ];
   


   calculatedRoomDimension.forEach(data => {
     // Create table row
     const row = document.createElement('tr');
   
     // Create table cell for title
     const titleCell = document.createElement('td');
     titleCell.textContent = data.title;
     row.appendChild(titleCell);
   
     // Create table cell for squarefoot box
     const inputBoxCell = document.createElement('td');
     const sizeInputBox = document.createElement('p');
     sizeInputBox.setAttribute('class', 'calculatedSizes');

     sizeInputBox.textContent = '0 sqft';
     inputBoxCell.appendChild(sizeInputBox);
     row.appendChild(inputBoxCell);

    // Create table cell for prices box
    const inputBoxCell2 = document.createElement('td');
    const priceInputBox = document.createElement('p');
    priceInputBox.setAttribute('class', 'calculatedPrices');
    priceInputBox.textContent = '$0';
    inputBoxCell2.appendChild(priceInputBox);
    row.appendChild(inputBoxCell2);

    // Create table cell for prices box
    const inputBoxCell3 = document.createElement('td');
    const hoursInputBox = document.createElement('p');
    hoursInputBox.setAttribute('class', 'calculatedHours');
    hoursInputBox.textContent = '0 hours';
    inputBoxCell3.appendChild(hoursInputBox);
    row.appendChild(inputBoxCell3);

     // Append the row to the table
     calculatedRoomDimensionTable.appendChild(row);
   });

   rooomDimensionTableDiv.appendChild(roomDimensionTable); 
   rooomDimensionTableDiv.appendChild(calculatedRoomDimensionTable); // div one done. Add another div for the input dimensions and then put both of those into another div.


   // refers to the sizes: width, length, height, perimeter, baseboard perimeter, baseboard height. 
   // const sizes = document.getElementsByClassName('size');

   // finish making this button do the calculations. 
    calculateButton.addEventListener('click',function(){
      const parentDiv = calculateButton.closest('.newDivClass'); 

      const coatsArray = parentDiv.getElementsByClassName('coatsCellItem');
      const dimensionArray = parentDiv.getElementsByClassName('size'); 
      const primerCoatsArray = parentDiv.getElementsByClassName('primerCoatsCellItem');
      const calculatedSizes = parentDiv.getElementsByClassName('calculatedSizes'); 
      const calculatedPrices = parentDiv.getElementsByClassName('calculatedPrices'); 
      const calculatedHours = parentDiv.getElementsByClassName('calculatedHours'); 

      var width = parseFloat(dimensionArray[0].value);
      var length = parseFloat(dimensionArray[1].value);
      var height = parseFloat(dimensionArray[2].value);
      var perimeter = parseFloat(dimensionArray[3].value)
      var baseboardPerimeter = parseFloat(dimensionArray[4].value)
      var baseboardHeight = parseFloat(dimensionArray[5].value);
  
      if (!isNaN(width) && !isNaN(length) && !isNaN(height) && !isNaN(baseboardHeight) && !isNaN(baseboardPerimeter) && !isNaN(perimeter)) {
        // calculatedSizes[0].textContent = ((coatsArray[0].value + primerCoatsArray[0].value)*((perimeter * height).toFixed(2))).toString() + ' sqft';
        calculatedSizes[0].textContent = ((parseFloat(coatsArray[0].value) + parseFloat(primerCoatsArray[0].value)) * (perimeter * height).toFixed(2)).toFixed(2) + ' sqft';

        calculatedSizes[1].textContent = ((parseFloat(coatsArray[1].value) + parseFloat(primerCoatsArray[1].value)) * (width * length).toFixed(2)).toFixed(2) + ' sqft';

        calculatedSizes[2].textContent = ((parseFloat(coatsArray[2].value) + parseFloat(primerCoatsArray[2].value)) * (baseboardPerimeter * baseboardHeight).toFixed(2)).toFixed(2) + ' sqft';

        // calculatedSizes[1].textContent = (coatsArray[1].value + primerCoatsArray[1].value)*((width * length).toFixed(2).toString()) + ' sqft';
        // calculatedSizes[2].textContent = (coatsArray[2].value + primerCoatsArray[2].value)*((baseboardPerimeter * baseboardHeight).toFixed(2).toString()) + ' sqft';
  
        calculatedPrices[0].textContent = '$' + (parseFloat(wallRate.value) * parseFloat(calculatedSizes[0].textContent.replace(' sqft', ''))).toFixed(2);
        calculatedPrices[1].textContent = '$' + (parseFloat(ceilingRate.value) * parseFloat(calculatedSizes[1].textContent.replace(' sqft', ''))).toFixed(2);
        calculatedPrices[2].textContent = '$' + (parseFloat(baseboardRate.value) * parseFloat(calculatedSizes[2].textContent.replace(' sqft', ''))).toFixed(2);
  
        calculatedHours[0].textContent = (parseFloat(calculatedSizes[0].textContent.replace(' sqft', '')) / parseFloat(wallEfficiency.value)).toFixed(2) + ' hours';
        calculatedHours[1].textContent = (parseFloat(calculatedSizes[1].textContent.replace(' sqft', '')) / parseFloat(ceilingEfficiency.value)).toFixed(2) + ' hours';
        calculatedHours[2].textContent = (parseFloat(calculatedSizes[2].textContent.replace(' sqft', '')) / parseFloat(baseboardEfficiency.value)).toFixed(2) + ' hours';

      }

   });




    

  // Insert the items into the new div

  newDiv.appendChild(divHoldingTitleAndButton); 
  newDiv.appendChild(newAdditionalComments);
  newDiv.appendChild(table); 
  newDiv.appendChild(roomDimensions); 
  newDiv.appendChild(roomDimensionTable);
  newDiv.appendChild(calculatedRoomDimensionTable);

  // add this room item to the working estimate. 
  parentDiv.appendChild(newDiv);


});




/* ------------------------- this is the content for the Custom button ------------------------- */ 



const customItemButton = document.getElementById('customItem');


// Add event listener to the button
customItemButton.addEventListener('click', function() {
  //enableDragAndDrop();

  // Create a new div element
  const customItemDiv = document.createElement('div');
  customItemDiv.classList.add('draggable-item'); 


  // Create the elements that will go into the new item div
  const newTitle = document.createElement('input');


  const masterDiv = document.createElement('div'); 
  masterDiv.setAttribute('class','divsAligningCustomItem'); 
  const newAdditionalComments = document.createElement('textarea');
  masterDiv.appendChild(newAdditionalComments); 
  //const roomDimensions = document.createElement('p');

  // for the div holding the calculated values of the custom item. 
  //const divHoldingCalculatingValues = document.createElement('div'); 
  //divHoldingCalculatingValues.setAttribute('class','divsAligningCustomItem'); 


  // Customize the new div with content and styling
  customItemDiv.classList.add('customItemDivClass'); // assigns a class to the newItems div.
  newTitle.classList.add('newTitleClass');
  newAdditionalComments.classList.add('customItemAdditionalComments');
  //roomDimensions.classList.add('roomDimensions'); 
  
  // Customize the input elements
  newTitle.setAttribute('type', 'text');
  newTitle.setAttribute('placeholder', 'Enter the title here');
  newAdditionalComments.setAttribute('placeholder', 'Enter additional comments here');
  //roomDimensions.textContent = "Room Dimensions"

    // Create the table element
    const table = document.createElement('table');
    table.classList.add('myTable'); 


    // First Row
    const row = document.createElement('tr');
    const h1 = document.createElement('th');
    h1.textContent = "Item Name";
    const itemName = document.createElement('td');
    const itemNameInput = document.createElement('input');
    itemNameInput.setAttribute("class","customItemInputs");
    //itemNameInput.setAttribute("class","colourInput2");
    itemNameInput.setAttribute('type', 'text');
    itemName.appendChild(itemNameInput);
    row.appendChild(h1); 
    row.appendChild(itemName); 

    // for the second row
    const rowTwo = document.createElement('tr'); 
    const h2 = document.createElement('th');
    h2.textContent = "Number of Items";
    const coatsCell = document.createElement('td');
    const coatsInput = document.createElement('input');
    coatsInput.setAttribute("class","customItemInputs");
    //coatsInput.setAttribute("class","coatsCellItem")
    coatsInput.setAttribute('type', 'number');
    coatsCell.appendChild(coatsInput);
    rowTwo.appendChild(h2); 
    rowTwo.appendChild(coatsCell);

    // for the third row: 
    const rowThree = document.createElement('tr'); 
    const h3 = document.createElement('th'); 
    h3.textContent = "Cost Per Item";
    const costCell = document.createElement('td');
    const costInput = document.createElement('input');
    costInput.setAttribute("class","customItemInputs");
    //costInput.setAttribute("class","colourInput2")
    costInput.setAttribute('type', 'text');
    costCell.appendChild(costInput);
    rowThree.appendChild(h3); 
    rowThree.appendChild(costCell); 

    // for the fourth row: 
    const rowFour = document.createElement('tr'); 
    const h4 = document.createElement('th');
    h4.textContent = "Colour";
    const colourCell = document.createElement('td'); 
    const colourInput = document.createElement('input'); 
    colourInput.setAttribute('type','text'); 
    colourInput.setAttribute('class','colourInput');
    colourInput.setAttribute("class","customItemInputs");
    colourInput.setAttribute('list','colourDataList'); 
    colourCell.appendChild(colourInput)
    rowFour.appendChild(h4); 
    rowFour.appendChild(colourCell); 

    // for the fifth row
    const rowFive = document.createElement('tr'); 
    const h5 = document.createElement('th');
    h5.textContent = "Paint required per item";
    const estimatedPaintCell = document.createElement('td'); 
    const estPaint = document.createElement('input'); 
    estPaint.setAttribute("class","customItemInputs");
    estPaint.setAttribute('type','text'); 
    estPaint.setAttribute('placeholder','gallons'); 
    //estPaint.setAttribute('class','paintInputDiv');
    estimatedPaintCell.appendChild(estPaint); 
    rowFive.appendChild(h5); 
    rowFive.appendChild(estimatedPaintCell); 

    // for the sixth row
    const rowSix = document.createElement('tr'); 
    const h6 = document.createElement('th'); 
    h6.textContent = "Time required per item";
    const estimatedTimeCell = document.createElement('td'); 
    const estTime = document.createElement('input'); 
    estTime.setAttribute("class","customItemInputs");
    estTime.setAttribute('type','text'); 
    estTime.setAttribute('placeholder','hours'); 
    estimatedTimeCell.appendChild(estTime); 
    rowSix.appendChild(h6); 
    rowSix.appendChild(estimatedTimeCell); 

    table.appendChild(row); 
    table.appendChild(rowTwo); 
    table.appendChild(rowThree); 
    table.appendChild(rowFour); 
    table.appendChild(rowFive); 
    table.appendChild(rowSix); 





    //table.appendChild(row); 
    //const rowOne = document.createElement('tr');

    // Create the item name. 
    // const itemName = document.createElement('td');
    // const itemNameInput = document.createElement('input');
    // itemNameInput.setAttribute("class","colourInput2");
    // itemNameInput.setAttribute('type', 'text');
    // itemName.appendChild(itemNameInput);
    //rowOne.appendChild(itemName); 

    // Create number of items input cell

    // Input the cost per item. 
    // const costCell = document.createElement('td');
    // const costInput = document.createElement('input');
    // costInput.setAttribute("class","colourInput2")
    // costInput.setAttribute('type', 'text');
    // costCell.appendChild(costInput);
    // rowOne.appendChild(costCell); 
    // table.appendChild(rowOne);

    // const row2 = document.createElement('tr');
    // const h2_1 = document.createElement('th');
    // h2_1.textContent = "Colour";
    // row2.appendChild(h2_1); 
    // const h2_2 = document.createElement('th');
    // h2_2.textContent = "Paint required per item";
    // row2.appendChild(h2_2); 
    // const h2_3 = document.createElement('th'); 
    // h2_3.textContent = "Time required per item";
    // row2.appendChild(h2_3); 
    //table.appendChild(row2); 
    //const rowTwo = document.createElement('tr');

    // const estimatedPaintCell = document.createElement('td'); 
    // const estPaint = document.createElement('input'); 
    // estPaint.setAttribute('type','text'); 
    // estPaint.setAttribute('placeholder','litres'); 
    // estPaint.setAttribute('class','paintInputDiv');
    // estimatedPaintCell.appendChild(estPaint); 
    // rowTwo.appendChild(estimatedPaintCell); 
    // table.appendChild(rowTwo); 

    // const estimatedTimeCell = document.createElement('td'); 
    // const estTime = document.createElement('input'); 
    // estTime.setAttribute('type','text'); 
    // estTime.setAttribute('placeholder','hours'); 

    // estimatedTimeCell.appendChild(estTime); 
    // rowTwo.appendChild(estimatedTimeCell); 
    // table.appendChild(rowTwo); 


    // this code is for the colour box in the custom item box. 
    var colorBoxes2 = document.getElementsByClassName('colourInput');

    Array.from(colorBoxes2).forEach(function(colorBox) {
      colorBox.addEventListener('blur', function() { 
        updateColourList2();
      });
    });

    function updateColourList2() {
      // Clear the existing options in the datalist
      colourList.innerHTML = '';
    
      // Iterate over all colorBoxes and add options with non-empty values to the datalist
      Array.from(colorBoxes2).forEach(function(colorBox) {
        if (colorBox.value.trim() !== '') {
          // Check if the value already exists in the datalist
          var exists = Array.from(colourList.options).some(function(option) {
            return option.value.toLowerCase() === colorBox.value.toLowerCase();
          });
    
          if (!exists) {
            // Create a new option element
            var newOption = document.createElement('option');
            newOption.setAttribute('value', colorBox.value);
    
            // Append the new option to the datalist
            colourList.appendChild(newOption);
          }
        }
      });
    }


    const divHoldingTitleAndButton = document.createElement('div'); 
    const calculateButton = document.createElement('button'); 
    calculateButton.classList.add('calculateRoomDimensionsButton')
    divHoldingTitleAndButton.style.display = 'flex';
    divHoldingTitleAndButton.style.justifyContent = 'space-between'; // or 'flex-end' for rightmost alignment
    divHoldingTitleAndButton.appendChild(newTitle); 
    divHoldingTitleAndButton.appendChild(calculateButton); 
    calculateButton.textContent = 'calculate'; 




   // The code below manages all of the calculation functionality for the logic inside of the custom item div. 
    const totalCost = document.createElement('p'); 
    //totalCost.classList.add('calculatedCustomItemPrices'); 
    const totalPaint = document.createElement('p'); 
    const totalTime = document.createElement('p'); 
    // totalTimeResult.classList.add('calculatedCustomItemTime'); 
    totalCost.textContent = 'Total Cost: '; 
    totalPaint.textContent = 'Total Paint: '; 
    totalTime.textContent = 'Total Time: '; 

    const totalCostResult = document.createElement('p'); 
    totalCostResult.classList.add('customItemCalculations');
    totalCostResult.textContent = '$0'; 
    const totalPaintResult = document.createElement('p'); 
    totalPaintResult.classList.add('customItemCalculations');
    totalPaintResult.textContent = '0 gallons'; 
    const totalTimeResult = document.createElement('p'); 
    totalTimeResult.classList.add('customItemCalculations');
    totalTimeResult.textContent = '0 hours'; 

    totalTimeResult.classList.add('calculatedCustomItemTime'); 
    totalCostResult.classList.add('calculatedCustomItemPrices'); 



    calculateButton.addEventListener('click', function(){

      var itemTotal1 = coatsInput.value * costInput.value; 
      totalCostResult.textContent = '$' + (Math.round(itemTotal1 * 100) / 100).toFixed(2);

      var itemTotal2 = coatsInput.value * estPaint.value; 
      totalPaintResult.textContent = '' + (Math.round(itemTotal2 * 100) / 100).toFixed(2) + ' gallons'; 

      var itemTotal3 = coatsInput.value * estTime.value; 
      totalTimeResult.textContent = '' + (Math.round(itemTotal3 * 100) / 100).toFixed(2) + ' hours'; 

    }); 


    // the calculated values (white text)
    const calculatedValuesDiv = document.createElement('div'); 
    calculatedValuesDiv.classList.add('calculatedValuesDiv'); 
    calculatedValuesDiv.appendChild(totalCost); 
    calculatedValuesDiv.appendChild(totalCostResult); 
    calculatedValuesDiv.appendChild(totalPaint); 
    calculatedValuesDiv.appendChild(totalPaintResult); 
    calculatedValuesDiv.appendChild(totalTime); 
    calculatedValuesDiv.appendChild(totalTimeResult); 



  masterDiv.appendChild(table); 

  // Insert the items into the new div
  customItemDiv.appendChild(divHoldingTitleAndButton);

  customItemDiv.appendChild(masterDiv); 

  //customItemDiv.appendChild(newAdditionalComments);
  customItemDiv.appendChild(calculatedValuesDiv); 

  // customItemDiv.appendChild(totalCost); 
  // customItemDiv.appendChild(totalPaint); 
  // customItemDiv.appendChild(totalTime); 



  parentDiv.appendChild(customItemDiv);


  // append the width length and height elements. 

});


/* ------------------------- this is the content for the job summary ------------------------- */ 


const getTotalLabourCost = function() {
  const dollarValues = [];

  const dollarElements = parentDiv.getElementsByClassName('calculatedPrices');
  // this for loop pushes all the 'room' dollar values to the array. 
  for (const element of dollarElements) {
    const textContent = element.textContent;
    const newVal = parseFloat(textContent.replace('$', ''));
    dollarValues.push(newVal);
  }
  const dollarElementsCustomItem = parentDiv.getElementsByClassName('calculatedCustomItemPrices'); 
  // this for loop pushes all the 'custom item' dollar values to the array. 
  for (const element of dollarElementsCustomItem) {
    const textContent = element.textContent;
    const newVal = parseFloat(textContent.replace('$', ''));
    dollarValues.push(newVal);
  }

  const totalLabourCost = dollarValues.reduce((a, b) => a + b, 0);
  return totalLabourCost.toFixed(2); // Returns the sum of the values as a string with 2 decimal places.
};


const getTotalTimeRequired = function(){
  const timeValues = [];
  const timeElements = parentDiv.getElementsByClassName('calculatedHours');
  // this for loop pushes all the 'room' dollar values to the array. 
  for (const element of timeElements) {
    const textContent = element.textContent;
    const newVal = parseFloat(textContent.replace(' hours', ''));
    timeValues.push(newVal);
  }
  const timeElementsCustomItem = parentDiv.getElementsByClassName('calculatedCustomItemTime'); 
  // this for loop pushes all the 'custom item' dollar values to the array. 
  for (const element of timeElementsCustomItem) {
    const textContent = element.textContent;
    const newerVal = parseFloat(textContent.replace(' hours', '')); 
    timeValues.push(newerVal);
  }
  const totalTime = timeValues.reduce((a, b) => a + b, 0);
  return totalTime.toFixed(2); // Returns the sum of the values as a string with 2 decimal places.
  // this will return the total time required. 
}


// for the paint table generating function. 
var paintRequiredDictionary = {};
const roomItems = parentDiv.getElementsByClassName('newDivClass');

const generatePaintTable = function () {

    for (const room of roomItems) {
      // get reference to the colour boxes.
      const roomColours = room.getElementsByClassName('colourInput');
      const roomSQFTItems = room.getElementsByClassName('calculatedSizes');
      const numberOfPaintCoats = room.getElementsByClassName('coatsCellItem'); 
      const numberOfPrimerCoats = room.getElementsByClassName('primerCoatsCellItem'); 


      var counter = 0;
  
      // if there is a value in the box and it isn't a key in the dictionary, add it
      // and then add the appropriate sqft value.
      for (const colour of roomColours) {
          if (colour.value !== '') {
            var sqftValue = 0.0; 
            var fraction = 0.0; 

              switch (counter){
                case 0: 
                  fraction = numberOfPaintCoats[0].value / (parseFloat(numberOfPaintCoats[0].value) + parseFloat(numberOfPrimerCoats[0].value)); 
                  sqftValue = parseFloat((roomSQFTItems[0].textContent.replace(' sqft', ''))*fraction);

                  break; 
                case 1: 
                  fraction = numberOfPrimerCoats[0].value / (parseFloat(numberOfPaintCoats[0].value) + parseFloat(numberOfPrimerCoats[0].value)); 
                  sqftValue = parseFloat((roomSQFTItems[0].textContent.replace(' sqft', ''))*fraction);
                  break; 
                case 2: 
                  fraction =  numberOfPaintCoats[1].value / (parseFloat(numberOfPaintCoats[1].value) + parseFloat(numberOfPrimerCoats[1].value)); 
                  sqftValue = parseFloat((roomSQFTItems[1].textContent.replace(' sqft', ''))*fraction);
                  break; 
                case 3: 
                  fraction =  numberOfPrimerCoats[1].value / (parseFloat(numberOfPaintCoats[1].value) + parseFloat(numberOfPrimerCoats[1].value)); 
                  sqftValue = parseFloat((roomSQFTItems[1].textContent.replace(' sqft', ''))*fraction);
                  break; 
                case 4: 
                  fraction =  numberOfPaintCoats[2].value / (parseFloat(numberOfPaintCoats[2].value) + parseFloat(numberOfPrimerCoats[2].value)); 
                  sqftValue = parseFloat((roomSQFTItems[2].textContent.replace(' sqft', ''))*fraction);
                break; 
                case 5: 
                  fraction =  numberOfPrimerCoats[2].value / (parseFloat(numberOfPaintCoats[2].value) + parseFloat(numberOfPrimerCoats[2].value)); 
                  sqftValue = parseFloat((roomSQFTItems[2].textContent.replace(' sqft', ''))*fraction);
                break; 
              }
              //sqftValue *= 10; 

              if (!(colour.value in paintRequiredDictionary)) {
                  paintRequiredDictionary[colour.value] = sqftValue;
              } else {
                  paintRequiredDictionary[colour.value] += sqftValue;
              }
          }
          counter++;
      }
  }

  // here you will loop through the custom items as you did with the room items and append 




    const tr = document.createElement('tr'); 
    const th1 = document.createElement('th')
    th1.textContent = "Colour";
    const th2 = document.createElement('th')
    th2.textContent = "Coverage";
    const th3 = document.createElement('th')
    th3.textContent = "gallons"; 

    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)

    tr.setAttribute('class','paintEstimateTableRows'); 
    estimateSummaryTable.appendChild(tr); 

    for (const key in paintRequiredDictionary) {
        const tr = document.createElement('tr');
        tr.setAttribute('class','paintEstimateTableRows'); 
        const inp = document.createElement('input'); 
        inp.setAttribute('type','text'); 
        inp.setAttribute('placeholder', 'sqft/gallon'); 
        inp.value = 400; 
        const p = document.createElement('p');
        const p2 = document.createElement('p'); 
      
        inp.addEventListener('blur', function() {
          const litresReq = parseFloat(paintRequiredDictionary[key] / inp.value).toFixed(2); 
          p2.textContent = litresReq; 
        });

        const litresReq = parseFloat(paintRequiredDictionary[key] / inp.value).toFixed(2); 
        p.textContent = key; 
        p2.textContent = litresReq; 
        tr.appendChild(p);
        tr.appendChild(inp); 
        tr.appendChild(p2); 
        
        // each tr will be appended to estimateSummaryTable:
        estimateSummaryTable.appendChild(tr);
    }
}






const getMaterialsCost = function(){

  // this will return the total materials cost.
}
const getTotalJobCost = function(){

  // this will return the total job cost. 
}



var estimateSummaryCalculated = false;

const genEstimateButton = document.getElementById('genEstimate');
const estimateSummaryDiv = document.getElementById('estimateSummaryTable');
const estimateSummaryTable = document.createElement('table');

const rowOne = document.createElement('tr');
const rowTwo = document.createElement('tr');
const rowThree = document.createElement('tr');
const rowFour = document.createElement('tr');
const rowFive = document.createElement('tr');

rowOne.classList.add('estimateSummaryTableRows'); 
rowTwo.classList.add('estimateSummaryTableRows'); 
rowThree.classList.add('paintEstimateTableRows')
rowFour.classList.add('estimateSummaryTableRows'); 
rowFive.classList.add('estimateSummaryTableRows'); 


const th1LabourCost = document.createElement('th');
const th2TimeRequired = document.createElement('th');
const th3PaintRequired = document.createElement('th');
const th4MaterialsCost = document.createElement('th');
const th5TotalJobCost = document.createElement('th');

const labourCostP = document.createElement('p');
const timeRequiredP = document.createElement('p');
const paintRequiredP = document.createElement('p');
const materialsCostP = document.createElement('p');
const totalJobCostP = document.createElement('p');

labourCostP.textContent = 'Labour Cost: $';
timeRequiredP.textContent = 'Time Required: ';
paintRequiredP.textContent = 'Paint Required: ';
materialsCostP.textContent = 'Material Cost: ';
totalJobCostP.textContent = 'Total Job Cost: ';

th1LabourCost.appendChild(labourCostP);
th2TimeRequired.appendChild(timeRequiredP);
th3PaintRequired.appendChild(paintRequiredP);
th4MaterialsCost.appendChild(materialsCostP);
th5TotalJobCost.appendChild(totalJobCostP);

rowOne.appendChild(th1LabourCost);
rowTwo.appendChild(th2TimeRequired);
rowThree.appendChild(th3PaintRequired);
rowFour.appendChild(th4MaterialsCost);
rowFive.appendChild(th5TotalJobCost);

// Variables that will be manipulated later.
var labourCost = 0;
var timeRequired = 0;
var materialsCost = 0;
var totalJobCost = 0;

const createEstimateTable = function(){
  estimateSummaryTable.appendChild(rowThree);
  generatePaintTable(); 

  estimateSummaryTable.appendChild(rowOne);
  estimateSummaryTable.appendChild(rowTwo);
  //estimateSummaryTable.appendChild(rowThree);
  //generatePaintTable(); 
  estimateSummaryTable.appendChild(rowFour);
  estimateSummaryTable.appendChild(rowFive);
  estimateSummaryDiv.appendChild(estimateSummaryTable);
  labourCostP.textContent = 'Labour Cost: $' +  getTotalLabourCost(); 
  timeRequiredP.textContent = 'Time Required: ' + getTotalTimeRequired() + ' hours'; 

  // Need to include the customItem paint values. 


}

const deleteEstimateTable = function() {
  // while it has a first child. 
  paintRequiredDictionary = {}; 
  while (estimateSummaryTable.firstChild){
    estimateSummaryTable.removeChild(estimateSummaryTable.firstChild); 
  }
  while (estimateSummaryDiv.firstChild) {
    estimateSummaryDiv.removeChild(estimateSummaryDiv.firstChild);
  }
}


genEstimateButton.addEventListener('click', function () {

  if (estimateSummaryCalculated == false) {
    createEstimateTable(); 
  } else {

    deleteEstimateTable(); 
    createEstimateTable(); 

  }
  estimateSummaryCalculated = true;

});

// for the sidebar functionality

// const toggleButton = document.getElementById('toggleSidebar');
// const sidebar = document.querySelector('.sidebar');
// const content = document.querySelector('.content');

// toggleButton.addEventListener('click', () => {
//     if (sidebar.style.left === '-310px') {
//         sidebar.style.left = '0';
//         content.style.marginLeft = '350px';
//     } else {
//         sidebar.style.left = '-310px';
//         content.style.marginLeft = '0';
//     }
// });


// for the dropdown in the sidebar functionality 

// // Get references to the button and the dropdown
// const openEstimateButton = document.getElementById("openEstimate");
// const dropdown = document.querySelector(".dropdown");

// // Add a click event listener to the "Open Estimate" button
// openEstimateButton.addEventListener("click", function() {
//     // Toggle the visibility of the dropdown when the button is clicked
//     if (dropdown.style.display === "none" || dropdown.style.display === "") {
//         dropdown.style.display = "block";
//     } else {
//         dropdown.style.display = "none";
//     }
// });

// this is for the slideout on the main screen: 

const interactiveDesign = document.getElementById('interactiveDesign');

// Function to slide the element in
function slideIn() {
  interactiveDesign.style.left = '0';
}

// Function to slide the element out
function slideOut() {
  interactiveDesign.style.left = '-1200px';
}

// Function to handle the scroll event
function handleScroll() {
  const windowHeight = window.innerHeight;
  const designTop = interactiveDesign.getBoundingClientRect().top;

  // You can adjust the threshold as needed
  if (designTop >= -windowHeight / 2 && designTop <= windowHeight / 2) {
    slideIn();
  } else {
    slideOut();
  }
}
// Event listener for when the element is in the middle of the screen
window.addEventListener('scroll', handleScroll);

// Initial slide out
//slideOut();





