import React, { useState, useEffect } from "react";
import "./TodoList.css";




function TodoList() {
  const [list, setList] = useState([]);
  const [input, setInput] = useState("");
  const [editedTask, setEditedTask] = useState(null);


  const deleteTodo = (id) => {
    const newList = list.filter((todo) => todo.id !== id);
    setList(newList);
  }

  //---güncelleme butonu işlemleri
  const editTask = (id) => {
    setEditedTask(id);
  };

  const saveEditedTask = (id, newTask) => {
    const updatedList = list.map((todo) =>
      todo.id === id ? { ...todo, gorev: newTask } : todo
    );
    setList(updatedList);
    setEditedTask(null);
  }; //---güncelleme butonu işlemleri





  // Görev ekleme işlevi
  const addTask = () => {
    if (input.trim() === '') {
      // Eğer görev boşsa hata mesajı göster

      alert("Yapılacaklar girişine boş metin eklenemez.");
    } else {
      // Görevi listeye ekleyin ve hata mesajını temizleyin
      const newGorev = {
        id: Math.random(),
        gorev: input,
      };
      setList([...list, newGorev]);
      setInput('');
      alert('Görev ekleme işlemi başarılı.');
    }
  };


  // Sayfa yüklendiğinde listedeki verileri local storage den almak
  useEffect(() => {
    const localDatas = JSON.parse(localStorage.getItem("taskList"));
    if (localDatas) {
      setList(localDatas);
    }
  }, []);



  // Liste her güncellendiğinde local storage de güncellenmesi
  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(list));
  }, [list]);




  // Eğer listede hiçbir iş yoksa To-Do List yazısını “Yeşil”, varsa “Siyah” olarak göstermek için;
  const isListEmpty = list.length === 0;


  // ...

  return (
    <div className="todo-container">
      <h1 style={{ color: isListEmpty ? "green" : "black" }}>Todo List</h1>
      <input
        className="todo-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button style={{ backgroundColor: "green", color: "white" }} onClick={addTask}>EKLE</button>
      <table>
        <thead>
          <tr>
            <th style={{ marginRight: "10px" }}>Görev</th>
            <th style={{ marginLeft: "10px" }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {list.map((todo) => (
            <tr key={todo.id}>
              <td>
                {editedTask === todo.id ? (
                  <div>
                    <input
                      type="text"
                      value={todo.gorev}
                      onChange={(e) => saveEditedTask(todo.id, e.target.value)}

                    />
                    <button onClick={() => saveEditedTask(todo.id, todo.gorev)}>
                      KAYDET
                    </button>
                  </div>
                ) : (
                  <div>{todo.gorev}</div>
                )}
              </td>
              <td>
                <button style={{ backgroundColor: "red", color: "white", marginRight: "10px" }} onClick={() => deleteTodo(todo.id)}>SİL</button>

                <button style={{ backgroundColor: "yellow", color: "gray", marginLeft: "10px" }} onClick={() => editTask(todo.id)}>DÜZENLE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default TodoList;
