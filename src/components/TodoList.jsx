import { useState } from 'react'

function TodoList() {
  const [todos, setTodos] = useState(['学 React', '跑通 npm 命令'])
  const [input, setInput] = useState('')

  function addTodo() {
    if (input.trim() === '') return
    setTodos([...todos, input.trim()])
    setInput('')
  }

  function removeTodo(index) {
    setTodos(todos.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h2>我的待办清单</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') addTodo()
        }}
        placeholder="输入新待办，回车添加"
      />
      <button type="button" onClick={addTodo}>
        添加
      </button>

      {todos.length === 0 ? (
        <p>暂无待办，添加一条吧</p>
      ) : (
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>
              {todo}
              <button type="button" onClick={() => removeTodo(index)}>
                删除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TodoList