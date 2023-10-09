// src/MyApp.js
import React, {useState, useEffect} from "react";
import Table from "./Table";
import Form from './Form';

function MyApp() {
  const [characters, setCharacters] = useState([]);

    function deleteUser(person) {
        console.log(person['id']);
        const promise = fetch(`http://localhost:8000/users/${person['id']}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return promise;
    }
  // function removeOneCharacter(index){
  //   // const updated = characters.filter((character, i) => {
  //   //   return i!== index;
  //   // });
  //   // setCharacters(updated);
  //   deleteUser(index)
  //             .then(() => )
  // }
  function removeOneCharacter(index) {
    deleteUser(characters.filter((character, i) => i == index)[0]) 
      .then((response) => {
        if (response == 204) {
          const updatedCharacters = characters.filter((character, i) => i !== index);
          setCharacters(updatedCharacters);
        } else if(response == 404) {
          console.log("Resource not found.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function updateList(person){
    postUser(person)
      .then((response) => {
        if(response == 201){
          setCharacters([...characters, person]);
        } else if(response == 404){
          console.log("Resouce not found.");
        }
      }
      )
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchUsers(){
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  function postUser(person){
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }
  useEffect(() => {
    fetchUsers()
                .then((res => res.json()))
                .then((json) => setCharacters(json["users_list"]))
                .catch((error) => { console.log(error); });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters}
        removeCharacter={removeOneCharacter} />
      <Form handleSubmit = {updateList} />
    </div>
  );
}
export default MyApp;
