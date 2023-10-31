import { createContext, useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

import { db } from "../firebase/config";

const defaultContextValue = {
  students: [],
  // select student to update invoice
  selectedStudent: null,
  setSelectedStudent: () => {},
  // select class
  selectedClass: null,
  setSelectedClass: () => {},
  // modal toggle
  openModal: false,
  setOpenModal: () => {},
  //delete student
  deleteStudent: null,
  setDeleteStudent: () => {},
};

export const AppContext = createContext(defaultContextValue);

function AppProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);
  useEffect(() => {
    const studentsRef = collection(db, "students");
    const querySnapshot = query(studentsRef, orderBy("createAt", "asc"));
    const unsubcribed = onSnapshot(querySnapshot, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        uid: doc.data().uid,
        name: doc.data().name,
        class: doc.data().class,
        createAt: doc.data().createAt,
      }));
      setStudents(documents);
    });
    return () => {
      unsubcribed();
    };
  });
  return (
    <AppContext.Provider
      value={{
        students,
        selectedStudent,
        setSelectedStudent,
        selectedClass,
        setSelectedClass,
        openModal,
        setOpenModal,
        deleteStudent,
        setDeleteStudent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;