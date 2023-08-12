import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const addForm = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      const confirmed = window.confirm(`${newName} is already in the phonebook. Replace the old number with the new one?`);

      if (confirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        axios.put(`http://localhost:3001/persons/${existingPerson.id}`, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => (person.id === existingPerson.id ? response.data : person)));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.error('Error updating person:', error);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      axios.post('http://localhost:3001/persons', newPerson)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          console.error('Error adding person:', error);
        });
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id);

    if (personToDelete && window.confirm(`Delete ${personToDelete.name}?`)) {
      axios.delete(`http://localhost:3001/persons/${id}`)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error('Error deleting person:', error);
        });
    }
  };

  const handler = (event) => {
    setNewName(event.target.value);
  };

  const numHandler = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addForm}>
        <div>
          name: <input
            value={newName}
            onChange={handler}
          />
        </div>

        <div>
          number: <input
            value={newNumber}
            onChange={numHandler}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ol>
        {persons.map(list => (
          <li key={list.id}>
            {list.name} - {list.number}
            <button onClick={() => handleDelete(list.id)}>Delete</button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;
