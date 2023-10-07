
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


  const isValidTime = (timeStr) => { //geçerli bir saat dizesini kontrol etmek için kullanılacak fonksiyon tanımlıyorum.
    // Saat değerini doğrula (örneğin, "HH:MM" formatına uymalıdır)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; //burada düzenli ifade (regex) tanımlanıyor. Bu regex, saat değerini kontrol etmek için kullanılacak.HH:MM gibi bir formata çevirecek.
    //([01]\d|2[0-3]): Saat bölümünü ifade eder. [01]\d 00-19 saat aralığını, 2[0-3] ise 20-23 saat aralığını temsil eder.([0-5]\d): Dakika bölümünü ifade eder. 
    //00-59 aralığındaki herhangi bir dakikayı temsil eder.

    return timeRegex.test(timeStr);/*Belirtilen regex (timeRegex) ile verilen saat dizesini (timeStr) karşılaştırır. 
    Eğer timeStr, belirtilen formata uyuyorsa, true döner; aksi halde false döner.*/
  };






  const saveEditedTask = (id, newTask) => {
    /*burada id ve newTask adında iki parametre alan bir arrow function tanımlıyoruz.*/
    const updatedList = list.map((todo) =>
      /*mevcut görev listesini kopyalayarak başlayıp her bir görev ögesini inceliyoruz.updatedList de güncellenmiş veriyi tutuyorum.
      list.map amacı her bir ögeyi alıp bir işlem yapmak ve sonucu yeni bir dizide tutmaya yarar.*/
      todo.id === id ? { ...todo, gorev: newTask } : todo
      /*her bir görevi inceliyoruz. Eğer görevin id si düzenlenen görevin id si ile eşleşiyorsa görev ögesi güncellenir. Eşleşmiyorsa
      olduğu gibi bırakıyoruz.*/
    );
    setList(updatedList);
    /*güncellenmiş görev listesini setList ile ayarlıyoruz.*/
    setEditedTask(null);
    /*editedTask durumunu sıfırlıyorum. Yani artık düzenleme için herhangi bir görevin seçilmediğini belirtir.*/
    saveToLocalStorage(updatedList);
    /*Güncellenmiş Veriyi localStorage'a kaydet.Bu kullanıcının sayfayı yeniden yüklediğinde veya tarayıcıyı kapattığında
    verilerin korunmasını sağlar.*/
  };




  /*useEffect ve Local Storage: Kodun, yerel depolamayı kullanarak görev listesini saklamak için localStorage'yı kullanıyor. 
  Ancak bu kodun örneklerinin her birini localStorage'a kaydetmek ve ondan almak için saveToLocalStorage ve getFromLocalStorage 
  fonksiyonlarını kullanıyoruz.*/
  useEffect(() => {
    const localDatas = getFromLocalStorage();
    if (localDatas.length > 0 && list.length === 0) {
      setList(localDatas);
    }
  }, [list]);

  useEffect(() => {
    saveToLocalStorage(list);
  }, [list]);



  const saveToLocalStorage = (data) => {
    /*saveToLocalStorage adlı arrow function da "data" adlı veri alınır*/
    localStorage.setItem("taskList", JSON.stringify(data));
    /*-->setItem yöntemi kullanılarak veriyi kaydediyoruz.
      -->"taskList": Bu, yerel depolama içinde saklanacak verinin bir anahtar (key) değeridir.
      -->veriyi bir JavaScript nesnesinden bir JSON dizgesine çevirir. Yerel depolama sadece metin tabanlı veriyi saklayabilir, 
    bu nedenle veriyi JSON formatına dönüştürmek önemlidir.
      -->tasklist e kaydedilen veri her şekilde korunacaktır.*/
  };





  /*bu metotda tarayıcıda saklanan verileri almak için kullanıyorum.*/
  const getFromLocalStorage = () => {
    const data = localStorage.getItem("taskList");
    /*taskList adlı key ile saklanmış veriyi alıyoruz.Bu veriyi "data" adlı bir değişkene atıyoruz.*/
    return data ? JSON.parse(data) : [];
    /* data ? ==> data adlı değişken bir değere sahipse yani null veya undefined değilse diğer işleme geçeriz. Yani,
      JSON.parse(data) ==> JSON formatından javascript nesnesine dönüştürmek için kullanılır. Metin tabanlı veri js nesnesine çevirilir.
      : [];  ==> data değeri yoksa veya yerel depolamadan veri alınmadıysa boş bir dizi döndürüyoruz.*/
  };







  useEffect(() => {
    /*useEffect bileşen render edildiğinde ya da "list" adlı deişken her değiştirildiğide çalışır.*/
    const localDatas = getFromLocalStorage();
    /*getFromLocalStorage ile localden veri alınır ve localDatas adlı değişkende saklanır.*/
    if (localDatas.length > 0 && list.length === 0) {
      /*localden alınan verinin uzunluğu 0 dan büyükse ve list dizisi boş ise;*/
      setList(localDatas);
    }/*list listesi, localdatas ile güncellenir.[list] içi localDatas ile doldurulur.*/
  }, [list]);





  useEffect(() => {
    /*list her değiştiğinde useEffect tetiklenir.*/
    saveToLocalStorage(list);
    /*list değişkeninin güncel içeriği local storage e yazdırılır.*/
  }, [list]);
  /*list değiştiğinde local storage e bu veri kayıt olur.
  ----->kodun temel amacı, list değişkenindeki veriyi herhangi bir değişiklik olduğunda otomatik olarak yerel depolamaya kaydetmektir. 
  Özellikle, kullanıcılar liste öğelerini ekledikçe, sildikçe veya düzenledikçe bu değişikliklerin kalıcı olarak saklanmasını sağlar. */






  const saveEditedTime = (id, newTime) => {
    /*saveEditedTime arrow function u id ve newTime adında iki parametre alır.*/
    const updatedList = list.map((todo) =>
      /*list.map amacı her bir ögeyi alıp bir işlem yapmak ve sonucu yeni bir dizide tutmaya yarar.*/

      todo.id === id ? { ...todo, tahminiSaat: newTime } : todo
      /*--->Eğer bir görevin kimliği (id) düzenlenen görevin kimliği ile eşleşiyorsa, 
      o zaman bu görevin tahmini saatini (tahminiSaat) newTime ile değiştiririz*/
    );
    setList(updatedList);
    /*Güncellenmiş görev listesini setList ile ayarlarız*/
  };
  /*bu kod, belirli bir görevin tahmini saatini düzenlemek ve güncellemek için kullanılır. 
  Kullanıcılar bir görevin tahmini saatini değiştirdiğinde, bu kod tahmini saati günceller ve güncellenmiş liste ile kullanıcıya gösterir.*/







  const startStopTimer = (id) => {
    /*bu arrow function id adında bir parametre alıp, id ye sahip görevin zamanlayıcısını */
    const updatedList = list.map((todo) => {

      /*list.map amacı her bir ögeyi alıp bir işlem yapmak ve sonucu yeni bir dizide tutmaya yarar. 
      Burada list adlı bir diziyi .map() yöntemiyle döngüye alırız. 
      Bu işlem, mevcut görev listesini kopyalayarak başlar ve her bir görev öğesini inceler.*/

      if (todo.id === id) {
        /*işlemdeki görevin kimliği (todo.id) argüman olarak geçilen id ile eşleşiyorsa çalışır.*/
        if (todo.timerRunning) {
          // Eğer bu işlemde süre çalışıyorsa ve duraklatılmışsa durdur
          /*Eğer görevin zamanlayıcısı (timerRunning) zaten çalışıyorsa ve görev duraklatılmışsa (false ise), bu kod görevin zamanlayıcısını durdurur. 
*/
          return { ...todo, timerRunning: false };
        } else {

          // Eğer bu işlemde süre çalışmıyorsa ve başlatılmadıysa başlat
          /*Eğer görevin zamanlayıcısı (timerRunning) çalışmıyorsa ve başlatılmamışsa (true ise), bu kod çalışır. 
          Bu durumda, bir görevin zamanlayıcısını başlatmak istiyoruz. 
          Ancak, eğer başka bir görevin zamanlayıcısı zaten çalışıyorsa, o zaman önceki zamanlayıcıyı durdurmalıyız.*/


          if (activeTaskId !== null) {

            // Eğer mevcut bir işlem zamanlayıcısı çalışıyorsa, durdur
            /* Eğer activeTaskId adlı değişken null değilse, yani başka bir görevin zamanlayıcısı zaten çalışıyorsa, bu blok içine girer.*/


            const existingActiveTask = list.find((task) => task.id === activeTaskId);
            /*Önceki aktif görevi (zamanlayıcısı çalışan görevi) bulmak için list içinde bir arama yapılır.*/

            if (existingActiveTask) {

              /* Eğer önceki aktif görev bulunduysa,*/

              existingActiveTask.timerRunning = false;

              /*bu görevin zamanlayıcısı durdurulur (timerRunning değeri false olarak güncellenir).*/
            }
          }
          setActiveTaskId(id); // Yeni işlemi aktif yap

          /*Yeni görevi aktif yapmak için setActiveTaskId fonksiyonunu çağırarak activeTaskId'yi güncelleriz. 
          Bu, yeni görevin zamanlayıcısının çalıştırılmasını sağlar.*/

          return { ...todo, timerRunning: true };
          /* Son olarak, yeni görevin zamanlayıcısını başlatırız. Yani, görevin timerRunning değerini true olarak güncelleriz.*/
        }
      } else if (activeTaskId === todo.id && todo.timerRunning) {

        // Başka bir göreve tıklandığında, mevcut görevin zamanlayıcısını durdur
        /*başka bir göreve tıklandığında, mevcut görevin zamanlayıcısını durdurmak için kullanılır. 
        Eğer kullanıcı başka bir göreve tıklarsa ve mevcut görevin zamanlayıcısı (timerRunning) çalışıyorsa, bu kod bu zamanlayıcıyı durdurur.*/


        return { ...todo, timerRunning: false };

      }
      return todo;
      /*Bu işlemin sonucunda her bir görev öğesini güncellemiş veya güncellememiş olabiliriz. 
      Eğer güncelleme yapılmamışsa, görev öğesi olduğu gibi bırakılır.*/
    });

    setList(updatedList);
    /*Güncellenmiş görev listesini setList ile ayarlarız. 
    Bu, görev listesini güncellemek ve kullanıcıya zamanlayıcı durumlarını göstermek için kullanılan bir işlevi çağırır.*/
  };








  const completeTask = (id) => {
    /*completeTask adında bir metot oluşturuyorum ve id parametresini gönderiyorum.*/
    const updatedList = list.map((todo) =>
      /*list.map amacı her bir ögeyi alıp bir işlem yapmak ve sonucu yeni bir dizide tutmaya yarar.*/
      todo.id === id
        ? {
          ...todo,
          tamamlandi: true, // Görevi tamamlandı olarak işaretle
        }
        : todo
      /* Her görev öğesini kontrol ederiz. Eğer bir görevin kimliği (todo.id) argüman olarak alınan id ile eşleşiyorsa, bu görevi güncelleriz.*/
    );
    setList(updatedList);
    /*Güncellenmiş görev listesini setList işlevi ile ayarlarız. 
    Bu, görev listesini güncellemek ve kullanıcıya güncellenmiş görevleri göstermek için kullanılan bir işlemdir.*/
  };

  /*Bu kod kullancıların belirli bir görevi "TAMAMLANDI" olarak işaretlenmesini sağlar.*/






  const toggleCompleted = (id) => {

    /*toggleCompleted adında bir arrow function tanımlıyorum ve buna id adında bir parametre gönderiyorum.*/

    const updatedList = list.map((todo) =>
      /*list.map amacı her bir ögeyi alıp bir işlem yapmak ve sonucu yeni bir dizide tutmaya yarar.*/

      todo.id === id ? { ...todo, tamamlandi: !todo.tamamlandi } : todo

      /*her görev ögesini kontrol ederiz. Eğer bir görevin id si seçilen id ile eşleşiyorsa, bu görevin "TAMAMLANDI" özelliğini
      tersine çeviriyoruz.*/

      /*{ ...todo, tamamlandi: !todo.tamamlandi }: Bu ifade, görevin tüm özelliklerini kopyalar ve tamamlandi özelliğini mevcut değerinin tersi olarak ayarlar. Yani, eğer görevin tamamlandi değeri true ise, bu ifade false olarak ayarlar; eğer false ise, true olarak ayarlar. 
      Bu, görevin "tamamlandı" durumunu tersine çevirir.*/

      /*: todo: Eğer bir görevin kimliği (todo.id) id ile eşleşmezse, bu görevi olduğu gibi bırakırız. Yani, bu görevi güncellemez ve mevcut haliyle listeye ekleriz.
      */
    );
    setList(updatedList);
    /*güncellenmiş görevleri setList ile ayarlayıp kullanıcıya görünmesi gereken liste ayarlanır.*/
  };





  useEffect(() => {

    /*list değişkeni her değiştiğinde veya bileşen ilk kez render edildiğinde bu efekt tetiklenir.*/

    const timerInterval = setInterval(() => {

      /*setInterval fonksiyonu kullanılarak bir zamanlayıcı başlatılır. Bu zamanlayıcı her saniyede bir çalışacak ve belirli görevleri
      güncelleyecektir.*/

      const updatedList = list.map((todo) => {

        /*list.map amacı her bir ögeyi alıp bir işlem yapmak ve sonucu yeni bir dizide tutmaya yarar.*/

        if (todo.timerRunning) {
          /*Her görev öğesini kontrol ederiz. Eğer bir görevin timerRunning özelliği true ise (yani, zamanlayıcı çalışıyorsa), bu kod çalışır.*/

          // Timer çalışıyorsa harcanan süreyi arttır
          const newSpentTime = addTime(todo.harcananSaat);

          /* Görevin "harcananSaat" özelliğini (geçen zaman) bir fonksiyon olan addTime ile güncelleriz. 
          Bu, görevin harcanan zamanını her saniyede bir arttırmamıza olanak sağlar.*/

          return { ...todo, harcananSaat: newSpentTime };

          /*Görevin diğer özelliklerini (spread operatörü {...todo} ile) kopyalar ve 
          "harcananSaat" özelliğini güncellenmiş değeriyle birlikte geri döner.*/

        }
        return todo;
        /*return todo;: Eğer bir görevin timerRunning özelliği false ise (yani, zamanlayıcı çalışmıyorsa), 
        bu görevi olduğu gibi bırakırız ve herhangi bir güncelleme yapmayız.*/

      });
      setList(updatedList);

      /*Güncellenmiş görev listesini setList olarak ayarlarız.*/

    }, 1000); // Her saniyede bir güncelle

    return () => {
      clearInterval(timerInterval); // Komponent kaldırıldığında zamanlayıcıyı temizle
    };
  }, [list]);



  /*Sonuç olarak, bu kod, belirli görevlerin zamanlayıcı tarafından güncellenmesini sağlar. 
  Eğer bir görevin zamanlayıcısı çalışıyorsa, her saniyede bir harcanan zamanı artırarak görevi günceller. 
  Eğer bileşen kaldırılırsa, zamanlayıcı temizlenir, bu da verimliliği ve bellek yönetimini sağlar.*/





  const addTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");

    /*Gelen saat dizesini iki parçaya bölmek için 'split(":")' yöntemini kullanırız. Bu saati ve dakikayı ayrı ayrı parçalara
    böler ve bunları hours ve minutes adlı değişkenlere atarız.*/

    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

    /*Saati dakikaya dönüştürmek için saat ve dakika değerlerini tamsayıya (parseInt) çeviririz. 
    Ardından, toplam dakika hesaplamak için saatleri 60 ile çarparız ve dakika değerini ekleriz. 
    Bu, saat dilimini toplam dakika cinsinden ifade eder.*/

    const newTotalMinutes = totalMinutes + 1; // Bir saniye ekle

    /*Zaman dilimine bir saniye eklemek için toplam dakikalara 1 ekleriz.*/

    const newHours = Math.floor(newTotalMinutes / 60);

    /*Toplam dakikaları saatlere dönüştürmek için, toplam dakikaları 60'a böleriz ve sonucu aşağıya yuvarlarız (Math.floor). 
    Bu bize eklenen dakikaların saatler cinsinden değerini verir.*/

    const newMinutes = newTotalMinutes % 60;

    /* Eklenen dakikaların saatleri çıkarıldığında geriye kalan dakikaları bulmak için toplam dakikaları 60'a modüler (bölümünden kalan)
     işlemiyle işleriz. Bu, saatler dönüştürüldükten sonra kalan dakikaları temsil eder.*/

    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;

    /*yeni saat ve dakikaları "HH:MM" formatında birleştiririz. padStart yöntemi ile saat ve dakika değerlerini iki haneli olarak formatlarız. 
    Örneğin, saat veya dakika değeri 9'dan küçükse, başına "0" ekleriz. 
    Sonuç olarak, yeni saat dilimini oluşturur ve bu değeri döndürürüz.*/

  };

  /*Süresi başlatılmamış yani o an aktif olmayan işlemde eğer harcanan süre tahmini süreyi geçtiyse “backgorund” kırmızı olacak.
  Geçmemişse mavi olacak.*/


  const calculateTimeDifference = (estimatedTime, spentTime) => {
    const [estimatedHours, estimatedMinutes] = estimatedTime.split(":").map(Number);

    /*Tahmin edilen zamanı (estimatedTime) saat ve dakika olarak ayırmak için split(":") yöntemini kullanırız. 
    Daha sonra map(Number) ile bu saat ve dakika değerlerini sayıya (Number) çeviririz. 
    Bu, estimatedHours ve estimatedMinutes adlı değişkenlere tahmin edilen saat ve dakika değerlerini atar.*/

    const [spentHours, spentMinutes] = spentTime.split(":").map(Number);

    /*Harcanan zamanı (spentTime) saat ve dakika olarak ayırmak için benzer bir işlem yaparız. 
    Bu da harcanan saat ve dakika değerlerini spentHours ve spentMinutes değişkenlerine atar.*/

    const estimatedMinutesTotal = estimatedHours * 60 + estimatedMinutes;

    /*Tahmin edilen zamanı dakikaya çevirmek için saatleri 60 ile çarparız ve dakika değeriyle toplarız.
     Bu, tahmin edilen zamanın toplam dakika cinsinden ifadesini sağlar.*/

    const spentMinutesTotal = spentHours * 60 + spentMinutes;

    /*Harcanan zamanı dakikaya çevirmek için benzer bir işlem yaparız. 
    Bu da harcanan zamanın toplam dakika cinsinden ifadesini sağlar.*/

    return spentMinutesTotal - estimatedMinutesTotal;

    /*Tahmin edilen zamanı harcanan zamandan çıkartarak iki zaman dilimi arasındaki farkı hesaplarız. 
    Sonuç olarak, bu farkı döndürürüz.*/

  };


  /*Bu fonksiyon, örneğin bir işin tahmini süresi ile gerçek süresi arasındaki farkı hesaplamak için kullanılabilir. Pozitif bir sonuç, işin tahmin edilenden daha fazla zaman aldığını gösterirken, 
  negatif bir sonuç işin tahmin edilenden daha az zaman aldığını gösterir.*/




  // Aynı anda sadece bir işlem için süre işletilebilir.

  const newTask = {
    id: Math.random(),
    gorev: input,
    tahminiSaat: estimatedTime,
    harcananSaat: spentTime,
    tamamlandi: completed,
    timerRunning: false, // Timer başlatılmadı
  };
  /*NEDEN 2 KERE YAZMIŞTIM BAKILACAK.*/


  const toggleTimer = (id) => {
    const updatedList = list.map((todo) => {

      /*list.map amacı her bir ögeyi alıp bir işlem yapmak ve sonucu yeni bir dizide tutmaya yarar.*/

      if (todo.id === id) {
        /*Her görev öğesini kontrol ederiz. Eğer bir görevin kimliği (todo.id) seçilen id ile eşleşiyorsa, bu kod çalışır.*/
        if (!todo.timerRunning) {

          /*Eğer bu işlemde süre çalışmıyorsa (yani timerRunning değeri false ise) ve henüz başlatılmamışsa, bu şart sağlanır.*/

          // Eğer bu işlemde süre çalışmıyorsa ve başlatılmadıysa başlat
          const anotherRunningTask = list.find((task) => task.timerRunning);

          /*Başka bir işlemde süre çalışıp çalışmadığını kontrol etmek için list içinde bir işlem ararız. 
          Eğer başka bir işlemde süre çalışıyorsa, anotherRunningTask adlı bir değişkene atanır.*/

          if (!anotherRunningTask || anotherRunningTask.id === id) {

            /*Eğer başka bir işlemde süre çalışmıyorsa (!anotherRunningTask) veya çalışan işlem 
            bu işlemse (anotherRunningTask.id === id), yeni işlem için süreyi başlatırız.*/

            return { ...todo, timerRunning: true };

            /*Yeni işlem için timerRunning özelliğini true olarak ayarlar ve bu işlemi güncellenmiş görev listesine ekler.*/

          } else {
            alert("Başka bir işlem için süre çalışıyor.");

            /*Eğer başka bir işlem için süre çalışıyorsa ve bu işlem farklı bir işlemse, kullanıcıya bir uyarı mesajı ("Başka bir işlem için süre çalışıyor.") 
            gösteririz ve mevcut görevi değiştirmeden bırakırız.*/

            return todo;
          }
        } else {
          // Eğer bu işlemde süre çalışıyorsa ve duraklatılmışsa durdur
          return { ...todo, timerRunning: false };

          /* İşlemi durdurmak için timerRunning özelliğini false olarak ayarlar ve bu işlemi güncellenmiş görev listesine ekler.*/
        }
      }
      return todo;

      /*Eğer bir görevin kimliği (todo.id) id ile eşleşmezse, bu görevi olduğu gibi bırakırız ve herhangi bir güncelleme yapmayız.*/

    });

    setList(updatedList);

    /* Güncellenmiş görev listesini setList işlevi ile ayarlarız*/

  };


  /*Bu kod, kullanıcının belirli bir işlem veya görev için bir zamanlayıcıyı başlatmasını veya duraklatmasını sağlar. 
  Ayrıca, başka bir işlem için zamanlayıcının zaten çalışıp çalışmadığını kontrol eder ve kullanıcıyı uyarmak için bir uyarı gösterebilir*/


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

                    <button className="button1"

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
                <button className="button2"
                  onClick={() => deleteTodo(todo.id)}
                  disabled={todo.timerRunning}>
                  SİL</button>
                <button className="button3" style={{ marginLeft: "10px", visibility: todo.tamamlandi ? "hidden" : "visible" }} onClick={() => editTask(todo.id)}>DÜZENLE</button>
                <button className="button4"
                  style={{ marginLeft: "10px", visibility: todo.tamamlandi ? "hidden" : "visible" }}
                  onClick={() => startStopTimer(todo.id)}
                >
                  {todo.timerRunning ? "DURDUR" : "BAŞLAT"}
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
