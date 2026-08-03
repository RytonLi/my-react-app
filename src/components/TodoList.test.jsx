import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TodoList from './TodoList'

describe('TodoList', () => {
  it('输入内容并点击添加后，新待办出现在列表里', () => {
    render(<TodoList />)

    const input = screen.getByPlaceholderText('输入新待办，回车添加')
    fireEvent.change(input, { target: { value: '学 GitHub Actions' } })
    fireEvent.click(screen.getByRole('button', { name: '添加' }))

    expect(screen.getByText('学 GitHub Actions')).toBeTruthy()
  })

  it('点击删除后，对应待办从列表里消失', () => {
    render(<TodoList />)

    // 初始有两项：学 React、跑通 npm 命令，先删第一项
    const deleteButtons = screen.getAllByRole('button', { name: '删除' })
    fireEvent.click(deleteButtons[0])

    expect(screen.queryByText('学 React')).toBeNull()
  })
})