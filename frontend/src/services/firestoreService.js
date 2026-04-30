import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const CHATS_COLLECTION = 'chats';
const USERS_COLLECTION = 'users';

// Chat operations
export async function createChat(userId, chatData) {
  const chatRef = doc(collection(db, USERS_COLLECTION, userId, CHATS_COLLECTION));
  const newChat = {
    ...chatData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    messages: []
  };
  
  await setDoc(chatRef, newChat);
  return { id: chatRef.id, ...newChat };
}

export async function getChat(userId, chatId) {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_COLLECTION, chatId);
  const chatSnap = await getDoc(chatRef);
  
  if (chatSnap.exists()) {
    return { id: chatSnap.id, ...chatSnap.data() };
  }
  return null;
}

export async function getUserChats(userId, maxChats = 50) {
  const chatsRef = collection(db, USERS_COLLECTION, userId, CHATS_COLLECTION);
  const q = query(chatsRef, orderBy('createdAt', 'desc'), limit(maxChats));
  const querySnapshot = await getDocs(q);
  
  const chats = [];
  querySnapshot.forEach((doc) => {
    chats.push({ id: doc.id, ...doc.data() });
  });
  
  return chats;
}

export async function updateChat(userId, chatId, updateData) {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_COLLECTION, chatId);
  await updateDoc(chatRef, {
    ...updateData,
    updatedAt: serverTimestamp()
  });
}

export async function addMessageToChat(userId, chatId, message) {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_COLLECTION, chatId);
  const chatSnap = await getDoc(chatRef);
  
  if (chatSnap.exists()) {
    const chatData = chatSnap.data();
    const updatedMessages = [...(chatData.messages || []), {
      ...message,
      timestamp: serverTimestamp()
    }];
    
    await updateDoc(chatRef, {
      messages: updatedMessages,
      updatedAt: serverTimestamp()
    });
    
    return { id: chatRef.id, ...chatData, messages: updatedMessages };
  }
  return null;
}

export async function deleteChat(userId, chatId) {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_COLLECTION, chatId);
  await deleteDoc(chatRef);
}

export async function updateMessageInChat(userId, chatId, messageIndex, newContent) {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_COLLECTION, chatId);
  const chatSnap = await getDoc(chatRef);
  
  if (chatSnap.exists()) {
    const chatData = chatSnap.data();
    const updatedMessages = [...(chatData.messages || [])];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent,
      edited: true,
      editedAt: serverTimestamp()
    };
    
    await updateDoc(chatRef, {
      messages: updatedMessages,
      updatedAt: serverTimestamp()
    });
    
    return { id: chatRef.id, ...chatData, messages: updatedMessages };
  }
  return null;
}

export async function deleteMessageFromChat(userId, chatId, messageIndex) {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_COLLECTION, chatId);
  const chatSnap = await getDoc(chatRef);
  
  if (chatSnap.exists()) {
    const chatData = chatSnap.data();
    const updatedMessages = [...(chatData.messages || [])];
    updatedMessages.splice(messageIndex, 1);
    
    await updateDoc(chatRef, {
      messages: updatedMessages,
      updatedAt: serverTimestamp()
    });
    
    return { id: chatRef.id, ...chatData, messages: updatedMessages };
  }
  return null;
}

// User settings operations
export async function getUserProfile(userId) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  return null;
}

export async function updateUserProfile(userId, profileData) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    ...profileData,
    updatedAt: serverTimestamp()
  });
}

// Saved prompts operations
export async function savePrompt(userId, promptData) {
  const promptRef = doc(collection(db, USERS_COLLECTION, userId, 'savedPrompts'));
  const newPrompt = {
    ...promptData,
    createdAt: serverTimestamp()
  };
  
  await setDoc(promptRef, newPrompt);
  return { id: promptRef.id, ...newPrompt };
}

export async function getSavedPrompts(userId) {
  const promptsRef = collection(db, USERS_COLLECTION, userId, 'savedPrompts');
  const q = query(promptsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const prompts = [];
  querySnapshot.forEach((doc) => {
    prompts.push({ id: doc.id, ...doc.data() });
  });
  
  return prompts;
}

export async function deleteSavedPrompt(userId, promptId) {
  const promptRef = doc(db, USERS_COLLECTION, userId, 'savedPrompts', promptId);
  await deleteDoc(promptRef);
}
