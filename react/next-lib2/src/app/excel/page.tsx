'use client'

import React, { useState, useCallback } from 'react'
import ExcelJS from 'exceljs'

const ExcelPage = () => {
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Sample gender data - this could come from an API or props
  const genders = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Others" }
  ]

  const generateTemplate = async () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Template')

    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Gender', key: 'gender', width: 15 }
    ]

    // Add dummy data with gender names
    worksheet.addRows([
      { name: 'John Doe', email: 'john.doe@example.com', gender: 'Male' },
      { name: 'Jane Smith', email: 'jane.smith@example.com', gender: 'Female' },
      { name: 'Alex Johnson', email: 'alex.j@example.com', gender: 'Others' },
      { name: '', email: '', gender: '' }
    ])

    // Create a hidden sheet for gender mapping
    const genderSheet = workbook.addWorksheet('GenderMapping')
    genderSheet.state = 'hidden'
    genderSheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Name', key: 'name' }
    ]
    genderSheet.addRows(genders)

    // Add data validation for Gender column
    worksheet.getColumn('gender').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`GenderMapping!$B$2:$B$${genders.length + 1}`]
        }
      }
    })

    // Style the header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

    // Generate and download the file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user_template.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file || !file.name.endsWith('.xlsx')) {
      alert('Please upload an Excel file (.xlsx)')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(e.target?.result as ArrayBuffer)
        const worksheet = workbook.getWorksheet('Template')
        
        if (!worksheet) {
          alert('No "Template" sheet found in the file')
          return
        }

        const data: any[] = []
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // Skip header
            const rowData = {
              name: row.getCell(1).value,
              email: row.getCell(2).value,
              gender: row.getCell(3).value
            }
            data.push(rowData)
          }
        })

        setPreviewData(data)
      } catch (error) {
        console.error('Error reading file:', error)
        alert('Error reading the file')
      }
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const resetPreview = () => {
    setPreviewData([])
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Excel Template Generator</h1>
      
      <div className="mb-6">
        <button
          onClick={generateTemplate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Template
        </button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-600">
          Drag and drop your Excel file here or click to select
        </p>
      </div>

      {previewData.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <button
              onClick={resetPreview}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Reset
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Gender</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{row.name}</td>
                    <td className="px-4 py-2 border">{row.email}</td>
                    <td className="px-4 py-2 border">
                      {row.gender} ({genders.find(g => g.name === row.gender)?.id})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExcelPage