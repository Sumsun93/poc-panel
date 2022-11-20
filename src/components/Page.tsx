/**
 * Package import
 */
import { useEffect } from 'react'

/**
 * Local import
 */

/**
 * Component
 */
const Page = ({ Component, title }: { Component: any, title: string }) => {
  useEffect(() => {
    document.title = `OptionRP - ${title}`
  }, [title])

  return <Component />
}

export default Page
