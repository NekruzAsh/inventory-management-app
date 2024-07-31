"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [itemName, setItemName] = useState("");
  const [currentItem, setCurrentItem] = useState({ name: "", quantity: 0 });
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const updateItem = async (oldName, newName, newQuantity) => {
    if (oldName !== newName) {
      const oldDocRef = doc(collection(firestore, "inventory"), oldName);
      const newDocRef = doc(collection(firestore, "inventory"), newName);
      const oldDocSnap = await getDoc(oldDocRef);

      if (oldDocSnap.exists()) {
        await setDoc(newDocRef, { quantity: newQuantity });
        await deleteDoc(oldDocRef);
      }
    } else {
      const docRef = doc(collection(firestore, "inventory"), newName);
      await setDoc(docRef, { quantity: newQuantity });
    }
    await updateInventory();
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenUpdate = (item) => {
    setCurrentItem(item);
    setNewName(item.name);
    setNewQuantity(item.quantity);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => setOpenUpdate(false);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Typography
        variant="h2"
        className="font-bold mb-10 uppercase text-[45px] py-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600"
      >
        Pantry Tracker
      </Typography>
      <Modal
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
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
                addItem(itemName);
                setItemName("");
                handleCloseAdd();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Item
          </Typography>
          <Stack width="100%" direction={"column"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="New Name"
              variant="outlined"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="New Quantity"
              variant="outlined"
              fullWidth
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                updateItem(currentItem.name, newName, newQuantity);
                handleCloseUpdate();
              }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>

      <TextField
        id="search"
        label="Search Items"
        className="bg-white w-96"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <Box
        width="800px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
        className="bg-white p-5 rounded-md"
      >
        <Typography variant={"h4"} color={"#333"} textAlign={"center"}>
          Inventory Items
        </Typography>
        <Button variant="contained" onClick={handleOpenAdd}>
          Add New Item
        </Button>
      </Box>

      <Box border={"1px solid #333"}>
        <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
              gap={2}
            >
              <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
                <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={"h6"} color={"#333"} textAlign={"center"}>
                  Quantity: {quantity}
                </Typography>
              </Box>
              <Box display={"flex"} gap={1}>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleOpenUpdate({ name, quantity })}
                >
                  Update
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
