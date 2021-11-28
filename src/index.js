  const LIBRARIES = {
    Skill: require("../../../Libraries/Skill"),
    FS: require("fs"),
    Path : require('path'),
    Jf : require('jsonfile')
  };

function addNewTodo(text, db, dbUrl){  
  return new Promise(
    function(resolve,reject){
        if (text != "" && text != undefined) {
          let newTodo = {id : db.todo[db.todo.length - 1].id + 1, text : text }
          db.todo.push(newTodo)
          LIBRARIES.FS.writeFileSync(dbUrl, JSON.stringify(db, null, 4), "utf8")
          resolve()
        }else{
          reject({response : "failed"})
        }
    }
  )
}

function deleteOneTodo(index, db, dbUrl){  
  return new Promise(
    function(resolve,reject){
        if (!isNaN(index) && index > 0) {
          db.todo.splice(index -1, 1)
          LIBRARIES.FS.writeFileSync(dbUrl, JSON.stringify(db, null, 4), "utf8")
          resolve()
        }else{
          reject({response : "failed"})
        }
    }
  )
}

class Todo extends LIBRARIES.Skill {
  constructor(_main, _settings) {
    super(_main, _settings);
    const SELF = this;
    const dbUrl = LIBRARIES.Path.join(SELF.Main.DirName,"lib","skills", "OualiS_nova-todo","src", "db.json")
    let db = JSON.parse(LIBRARIES.FS.readFileSync(dbUrl, 'utf8'));

    this.Main.Manager.addAction("todo.add", function(_intent, _socket){
      // console.log(_intent.Variables.text)
      addNewTodo(_intent.Variables.text, db, dbUrl).then(() => {
        _intent.answer(_socket);
      }).catch(() => {
        _intent.answer(_socket, "Une erreur est survenue");
      })
    });

    this.Main.Manager.addAction("todo.get", function(_intent, _socket){
      let i = 0
      let result = ""
      db.todo.forEach((element, index) => {
        if (index != db.todo.length -1) {
          result += `${element.text}, `   
        }else{
          result += `${element.text}`   
        }
              
      });
      _intent.answer(_socket, result)
    });

    this.Main.Manager.addAction("todo.getHowMany", function(_intent, _socket){
      let value = db.todo.length
      let tacheString = value > 1 ? "tâches" : "tâche"
      console.log(value, tacheString)
      _intent.answer(_socket, `Vous avez ${value} ${tacheString} dans votre todo list `)
    });

    this.Main.Manager.addAction("todo.deleteOne", function(_intent, _socket){
      // console.log(_intent.Variables.text)
      let index = _intent.Variables.number
      // console.log(_intent.Variables.number)
      deleteOneTodo(index, db, dbUrl).then(() => {
        let x = index > 1 ? "ème" : "er"
        _intent.answer(_socket, `Le ${index}${x} élément à été supprimé.`);
      }).catch(() => {
        _intent.answer(_socket, "Une erreur est survenue");
      })
    });
  }
}

module.exports = Todo;