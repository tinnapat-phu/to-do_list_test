const express = require("express");
const methodOverride = require('method-override');
const app = express();
let path = require('path')

const fs = require('fs');
let pages = null
let pagesName = null
let number_ID = 100;

fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    rawData = JSON.parse(data);
    pages = rawData.TaskList;
    pagesName = rawData.PageName;

  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});




app.set("view engine", "ejs");
app.use(methodOverride('_method'));

app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
app.use(express.static(path.join(__dirname,'public')));
app.get("/", function (req, res) {
    res.render("index", {
        data: pages,
        data_name: pagesName
    });
});
 
app.post("/", (req, res) => {
    number_ID++;
    
    const inputTodoTask = req.body.todoTask;
    const inputPage = req.body.todoPages;
 
    pages[inputPage].push({
        todoID: number_ID,
        todoTask: inputTodoTask,
        Editing: false
    });
 
    res.redirect("/");
});

app.post("/new", (req, res) => {
    number_ID++
    const newtodo = [
        {
            todoID: number_ID,
            todoTask: "New task...",
            Editing: false
        }

    ];
    const newpage = {
            Name: "The new To-Do List....",
            Editing: false
    }

    
    pages.push(newtodo)
    pagesName.push(newpage)
 
    res.redirect("/");
});
 
app.put('/toggle-edit/:id', (req, res) => {



    let inputPage = parseInt(req.body.todoPages);

    
    const id = parseInt(req.params.id);

    const todoIndex = pages[inputPage].findIndex(todo => todo.todoID === id);

    if (pages[inputPage][todoIndex].Editing) {
        console.log("มันเข้าตรงนี้ไหมนะ")
        console.log(req.body.todoTask,inputPage)

        pages[inputPage][todoIndex].todoTask = req.body.todoTask;
        
    }
  
    pages[inputPage][todoIndex].Editing = !pages[inputPage][todoIndex].Editing;
    

    res.redirect('/');

    
});

app.put('/pagename-edit/:id', (req, res) => {



    let index = parseInt(req.params.id);

    

    if (pagesName[index].Editing) {
        console.log("เข้าหรือยังจ้ะ")
        pagesName[index].Name = req.body.pageName;
        
    }
  
    pagesName[index].Editing = !pagesName[index].Editing;
    

    res.redirect('/');

    
});



app.delete('/deleteTask/:id', (req, res) => {

    let requestedtodoID = parseInt(req.params.id);
    let inputPage = parseInt(req.body.todoPages);
    let index = 0;
    console.log(inputPage)
    pages[inputPage].forEach((todo) => {
        
        if (parseInt(todo.todoID) === parseInt(requestedtodoID)) {
            pages[inputPage].splice(index , 1);
        }
        index++;
    });
    

    res.redirect("/");
});

app.delete('/deletePage/:id', (req, res) => {


    let inputPage = parseInt(req.params.id);

    pages.splice(inputPage , 1);
    pagesName.splice(inputPage,1)
    console.log(pagesName,inputPage)
    res.redirect("/");
});



 
app.listen(3000, (req, res) => {
    console.log("App is running on port 3000");
});