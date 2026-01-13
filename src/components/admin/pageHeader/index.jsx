import React from 'react'

const PageHeader = ({data}) => {
    const {heading,para}=data
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center">
        <div className="flex flex-col">
          <h2 className="text-3xl font-semibold">{heading}</h2>
          <p className="text-muted-foreground ">{para}</p>
        </div>
      </div>
  )
}

export default PageHeader
