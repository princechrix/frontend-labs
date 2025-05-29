import React from 'react'

const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
      <div className='max-w-2xl p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>Frontend Libraries Testing Ground</h1>
        <p className='text-gray-600 mb-4'>
          Welcome to my frontend libraries testing environment. This project serves as a dedicated space for:
        </p>
        <ul className='list-disc list-inside text-gray-600 space-y-2 mb-6'>
          <li>Experimenting with different frontend libraries and frameworks</li>
          <li>Testing library compatibility and integration</li>
          <li>Evaluating performance and features of various tools</li>
          <li>Building proof-of-concepts with different technologies</li>
        </ul>
        <p className='text-gray-600'>
          This sandbox environment allows me to safely explore and compare different frontend solutions
          without affecting production code.
        </p>
      </div>
    </div>
  )
}

export default HomePage