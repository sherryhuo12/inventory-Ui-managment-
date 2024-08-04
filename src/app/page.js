'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from './firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredInventory(filtered)
  }, [searchQuery, inventory])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField
        id="search-bar"
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderColor: '#007bff',
            '&:hover fieldset': {
              borderColor: '#0056b3', 
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0056b3', 
            },
          },
          backgroundColor: '#f0f8ff', 
          borderRadius: '8px', 
          boxShadow: 3, 
          marginY: 2, 
        }}
/>
      <Box border={'1px solid #333'}
          borderRadius={2}
          overflow="hidden"
          boxShadow={3}
          sx={{
            background: 'linear-gradient(135deg, #f0f0f0 30%, #d3d3d3 100%)', // Add a gradient background
            border: '2px solid #333',
        }}
  >
        <Box
          width="800px"
          height="70px"
          bgcolor={'#f8f8ff'}
          display={'flex'}
          boxShadow={3}
          borderRadius={2}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h3'} color={'#000'} textAlign={'center'}>
            Inventory List
          </Typography>
        </Box>
        <Stack width="800px" height="400px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="50px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f8ff'}
              paddingX={5}
              borderRadius={10} 
              boxShadow={3}
              
            >
              <Typography variant={'h5'} color={'#000'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'#0'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }} onClick={() => addItem(name)}>
               Add
              </Button>
              <Button variant="contained" sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkgreen' } }} onClick={() => removeItem(name)}>
                Remove
              </Button>
              <Button variant="contained" onClick={() => deleteItem(name)}>
                Delete
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
