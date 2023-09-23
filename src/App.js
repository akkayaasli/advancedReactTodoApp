
import React, { useState, useEffect } from "react";

import "./TodoList.css";





function TodoList() {
  const [list, setList] = useState([]);
  const [input, setInput] = useState("");
  const [editedTask, setEditedTask] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState("");
  // Tahmini süre alanı
  const [spentTime, setSpentTime] = useState("00:00");
  // Harcanan süre alanı
  const [completed, setCompleted] = useState(false); // Görev tamamlandı mı?

  const [activeTaskId, setActiveTaskId] = useState(null); // Aktif işlem ID'si











  const deleteTodo = (id) => {
    const newList = list.filter((todo) => todo.id !== id);
    setList(newList);
  };



  const editTask = (id) => {
    setEditedTask(id);

  };




  const addTask = () => {
    if (input.trim() === "") {
      alert("Görev girişine boş metin eklenemez.");
    } else if (!isValidTime(estimatedTime)) {
      alert("Geçerli bir tahmini süre girmelisiniz.");
    } else {
      const newTask = {
        id: Math.random(),
        gorev: input,
        tahminiSaat: estimatedTime,
        harcananSaat: spentTime, // Harcanan süre
        tamamlandi: completed, // Görev tamamlandı durumu

      };
      setList([...list, newTask]);
      setInput("");
      setEstimatedTime("");
      setSpentTime("");
      setCompleted(false); // Varsayılan olarak görev tamamlanmamış olur
      alert("Görev ekleme işlemi başarılı.");
    }
  };







  const isValidTime = (timeStr) => {
    // Saat değerini doğrula (örneğin, "HH:MM" formatına uymalıdır)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeStr);
  };


  const saveEditedTask = (id, newTask) => {
    const updatedList = list.map((todo) =>
      todo.id === id ? { ...todo, gorev: newTask } : todo
    );
    setList(updatedList);
    setEditedTask(null);
    saveToLocalStorage(updatedList); // Veriyi localStorage'a kaydet
  };



  const saveToLocalStorage = (data) => {
    localStorage.setItem("taskList", JSON.stringify(data));
  };

  const getFromLocalStorage = () => {
    const data = localStorage.getItem("taskList");
    return data ? JSON.parse(data) : [];
  };


  useEffect(() => {
    const localDatas = getFromLocalStorage();

    if (localDatas.length > 0 && list.length === 0) {
      setList(localDatas);
    }
  }, [list]);


  useEffect(() => {
    saveToLocalStorage(list);
  }, [list]);



  const saveEditedTime = (id, newTime) => {
    const updatedList = list.map((todo) =>
      todo.id === id ? { ...todo, tahminiSaat: newTime } : todo
    );
    setList(updatedList);
  };


  /*   const startStopTimer = (id) => {
      const updatedList = list.map((todo) =>
        todo.id === id
          ? {
            ...todo,
            timerRunning: !todo.timerRunning, // Zamanlayıcıyı başlat veya durdur
  
          }
          : todo
      );
      setList(updatedList);
    };
  
   */



  const startStopTimer = (id) => {
    const updatedList = list.map((todo) => {
      if (todo.id === id) {
        if (todo.timerRunning) {
          // Eğer bu işlemde süre çalışıyorsa ve duraklatılmışsa durdur
          return { ...todo, timerRunning: false };
        } else {
          // Eğer bu işlemde süre çalışmıyorsa ve başlatılmadıysa başlat
          if (activeTaskId !== null) {
            // Eğer mevcut bir işlem zamanlayıcısı çalışıyorsa, durdur
            const existingActiveTask = list.find((task) => task.id === activeTaskId);
            if (existingActiveTask) {
              existingActiveTask.timerRunning = false;
            }
          }
          setActiveTaskId(id); // Yeni işlemi aktif yap
          return { ...todo, timerRunning: true };
        }
      } else if (activeTaskId === todo.id && todo.timerRunning) {
        // Başka bir göreve tıklandığında, mevcut görevin zamanlayıcısını durdur
        return { ...todo, timerRunning: false };
      }
      return todo;
    });

    setList(updatedList);
  };





  const completeTask = (id) => {
    const updatedList = list.map((todo) =>
      todo.id === id
        ? {
          ...todo,
          tamamlandi: true, // Görevi tamamlandı olarak işaretle
        }
        : todo
    );
    setList(updatedList);
  };



  const toggleCompleted = (id) => {
    const updatedList = list.map((todo) =>
      todo.id === id ? { ...todo, tamamlandi: !todo.tamamlandi } : todo
    );
    setList(updatedList);
  };





  /*   const toggleTimer = (id) => {
      const updatedList = list.map((todo) => {
        if (todo.id === id) {
          if (!todo.timerRunning) {
            // Eğer bu işlemde süre çalışmıyorsa ve başlatılmadıysa başlat
            const anotherRunningTask = list.find((task) => task.timerRunning);
            if (!anotherRunningTask) {
  
              return { ...todo, timerRunning: true };
            } else {
              alert("Başka bir işlem için süre çalışıyor.");
              return todo;
            }
          } else {
            // Eğer bu işlemde süre çalışıyorsa ve duraklatılmışsa durdur
            return { ...todo, timerRunning: false };
          }
        }
        return todo;
      });
      setList(updatedList);
    };
   */







  useEffect(() => {
    const timerInterval = setInterval(() => {
      const updatedList = list.map((todo) => {
        if (todo.timerRunning) {
          // Timer çalışıyorsa harcanan süreyi arttır
          const newSpentTime = addTime(todo.harcananSaat);
          return { ...todo, harcananSaat: newSpentTime };
        }
        return todo;
      });
      setList(updatedList);
    }, 1000); // Her saniyede bir güncelle

    return () => {
      clearInterval(timerInterval); // Komponent kaldırıldığında zamanlayıcıyı temizle
    };
  }, [list]);



  const addTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const newTotalMinutes = totalMinutes + 1; // Bir saniye ekle
    const newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;

  };

  // Süresi başlatılmamış yani o an aktif olmayan işlemde eğer harcanan süre tahmini süreyi geçtiyse “backgorund” kırmızı olacak.Geçmemişse mavi olacak.
  const calculateTimeDifference = (estimatedTime, spentTime) => {
    const [estimatedHours, estimatedMinutes] = estimatedTime.split(":").map(Number);
    const [spentHours, spentMinutes] = spentTime.split(":").map(Number);

    const estimatedMinutesTotal = estimatedHours * 60 + estimatedMinutes;
    const spentMinutesTotal = spentHours * 60 + spentMinutes;

    return spentMinutesTotal - estimatedMinutesTotal;
  };


  // Aynı anda sadece bir işlem için süre işletilebilir.

  const newTask = {
    id: Math.random(),
    gorev: input,
    tahminiSaat: estimatedTime,
    harcananSaat: spentTime,
    tamamlandi: completed,
    timerRunning: false, // Timer başlatılmadı
  };


  const toggleTimer = (id) => {
    const updatedList = list.map((todo) => {
      if (todo.id === id) {
        if (!todo.timerRunning) {
          // Eğer bu işlemde süre çalışmıyorsa ve başlatılmadıysa başlat
          const anotherRunningTask = list.find((task) => task.timerRunning);
          if (!anotherRunningTask || anotherRunningTask.id === id) {
            return { ...todo, timerRunning: true };
          } else {
            alert("Başka bir işlem için süre çalışıyor.");
            return todo;
          }
        } else {
          // Eğer bu işlemde süre çalışıyorsa ve duraklatılmışsa durdur
          return { ...todo, timerRunning: false };
        }
      }
      return todo;
    });

    setList(updatedList);
  };



  const isListEmpty = list.length === 0;



  return (
    <div className="todo-container">

      <h1 style={{ color: isListEmpty ? "green" : "black" }}>Todo List</h1>





      <input
        className="todo-input"
        type="text"
        placeholder="Görev"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <input
        className="todo-input"
        type="text"
        placeholder="Tahmini Süre (HH:MM)"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(e.target.value)}
      />



      <button style={{ backgroundColor: "green", color: "white" }} onClick={addTask}>EKLE</button>
      <br />
      <table>
        <thead>
          <tr>
            <th style={{ marginRight: "10px" }}>Görev</th>
            <th style={{ marginRight: "10px" }}>Tahmini Süre</th>
            <th style={{ marginRight: "10px" }}>Harcanan Süre</th>
            <th style={{ marginLeft: "10px" }}>Tamamlanma Durumu</th>
            <th style={{ marginLeft: "10px" }}>İşlemler</th>


          </tr>
        </thead>
        <tbody>



          {list.map((todo) => (
            <tr key={todo.id} className={calculateTimeDifference(todo.tahminiSaat, todo.harcananSaat) > 0 ? "time-exceeded" : "time-ok"}
            >





              <td >
                {editedTask === todo.id ? (
                  <div>

                    <input
                      type="text"
                      value={todo.gorev}
                      onChange={(e) => saveEditedTask(todo.id, e.target.value)}


                    />
                    <input
                      type="text"
                      value={todo.tahminiSaat} // Tahmini süreyi görüntüle
                      onChange={(e) => saveEditedTime(todo.id, e.target.value)} // Tahmini süreyi kaydetmek için işlev ekleyin
                    />



                    <button onClick={() => saveEditedTask(todo.id, todo.gorev)}>
                      KAYDET
                    </button>
                  </div>
                ) : (
                  <div style={{ backgroundColor: todo.timerRunning ? "yellow" : "" }}>
                    <strong style={{ backgroundColor: todo.tamamlandi ? "green" : "transparent", color: todo.tamamlandi ? "white" : "black" }}>
                      {todo.gorev}
                    </strong>
                  </div>



                )}
              </td>


              <td>
                {todo.tahminiSaat}
              </td>


              <td>
                {todo.harcananSaat}
              </td>



              <td>
                {!todo.tamamlandi ? (
                  <div>



                    <button
                      style={{ backgroundColor: "green", color: "white", marginLeft: "10px" }}
                      onClick={() => completeTask(todo.id)}
                    >
                      TAMAMLA
                    </button>
                  </div>
                ) : (
                  <div>
                    Görev Tamamlandı
                  </div>
                )}
              </td>



              <td>
                <button style={{ backgroundColor: "red", color: "white", marginRight: "10px" }}
                  onClick={() => deleteTodo(todo.id)}
                  disabled={todo.timerRunning}>
                  SİL</button>

                <button style={{ backgroundColor: "yellow", color: "gray", marginLeft: "10px", visibility: todo.tamamlandi ? "hidden" : "visible" }} onClick={() => editTask(todo.id)}>DÜZENLE</button>

                <button
                  style={{ backgroundColor: "blue", color: "white", marginLeft: "10px", visibility: todo.tamamlandi ? "hidden" : "visible" }}
                  onClick={() => startStopTimer(todo.id)}
                >
                  {todo.timerRunning ? "Durdur" : "Başlat"}
                </button>






              </td>




            </tr>


          ))}



        </tbody>
      </table>
    </div >
  );

}

export default TodoList;
