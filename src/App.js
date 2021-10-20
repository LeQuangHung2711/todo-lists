import React, { useState, useEffect } from "react";
import List from "./components/List";
import Alert from "./components/Alert";
import "./App.css";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "Chưa nhập nhiệm vụ mới");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "Đã thay đổi");
    } else {
      showAlert(true, "success", "Nhiệm vụ mới đã được thêm vào");
      const newItem = { id: new Date().getTime().toString(), title: name };

      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, "danger", "Đã xoá tất cả nhiệm vụ");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "danger", "Đã xoá nhiệm vụ");
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <h3>Todo List</h3>
        <div className="form-control">
          <input type="text" className="grocery" placeholder="Nhập nhiệm vụ mới ..." value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="submit-btn">
            {isEditing ? "Sửa" : "Thêm"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Xoá tất cả
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
