import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
      

const addForm = (event) => {
  event.preventDefault();

  // Check if the name is at least three characters long
  if (newName.length < 3) {
    setNotification('Name must be at least three characters long');
    setTimeout(() => {
      setNotification(null);
    }, 3000);
    return; // Exit the function without submitting
  }

  const existingPerson = persons.find(person => person.name === newName);

  if (existingPerson) {
    const confirmed = window.confirm(`${newName} is already in the phonebook. Replace the old number with the new one?`);

    if (confirmed) {
      const updatedPerson = { ...existingPerson, number: newNumber };
      axios.put(`http://localhost:3001/api/persons/${existingPerson._id}`, updatedPerson)
        .then(response => {
          setPersons(persons.map(person => (person._id === existingPerson._id ? response.data : person)));
          setNewName('');
          setNewNumber('');
          setNotification(`Number for ${existingPerson.name} updated successfully.`);
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        })
        .catch(error => {
          console.error('Error updating person:', error);
          setNotification(`Error updating ${existingPerson.name}.`);
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        });
    }
  } else {
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    axios.post('http://localhost:3001/api/persons', newPerson)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');
        setNotification(`Added ${newName} successfully.`);
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      })
      .catch(error => {
        console.error('Error adding person:', error);
        setNotification(`Error adding ${newName}.`);
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
  }
};

  const handleDelete = (_id) => {
    const personToDelete = persons.find(person => person._id === _id);

    if (personToDelete && window.confirm(`Delete ${personToDelete.name}?`)) {
      axios.delete(`http://localhost:3001/api/persons/${_id}`)
        .then(() => {
          setPersons(persons.filter(person => person._id !== _id));
          setNotification(`${personToDelete.name} deleted.`);
          setTimeout(() => {
            setNotification(null);
          }, 3000);
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
      <Notification message={notification} />
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
          <li key={list._id}>
            {list.name} - {list.number}
            <button onClick={() => handleDelete(list._id)}>Delete</button>
          </li>
        ))}
      </ol>
    </div>
  );
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="notification">
      {message}
    </div>
  );
};

export default App;
