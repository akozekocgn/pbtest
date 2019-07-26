import React, { useState, useEffect } from 'react'

function Todo ({ data }) {
  return (
  <div className="item">
    {data.id}. {data.title}
  </div>
  )
}

function Todos () {
  const [isLoading, setLoader] = useState(false)
  const [list, setList] = useState([])
  useEffect(() => {
    async function fetchList() {
      setLoader(true)
      const listResponse = await fetch('https://jsonplaceholder.typicode.com/todos')
      const list = await listResponse.json()
      console.log(list)
      setList(list)
    }
    fetchList()
  }, [])

  return (
  <div className="todos-list">
    TODOS: {list.length}
    {
      list.map(item => (
        <Todo
          key={item.id}
          data={item}
        />
      ))
      
    }
  </div>)
}

export default Todos;