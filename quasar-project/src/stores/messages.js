import { defineStore } from 'pinia';
import { db } from 'src/boot/firebase.js'
import { ref as dbRef, push, set, onChildAdded, onChildChanged, get, update, off } from "firebase/database";
import { ref as vueRef } from 'vue'

export const useMessagesStore = defineStore('messages', () => {
    const messages = vueRef({})
    const messagesInfo = vueRef({
        isTyping: false,
        notifications: 0,
    })

    const firebaseSendMessage = (payLoad) => {
        if (payLoad.message.text) {
            push(dbRef(db, `messages/${payLoad.myId}/${payLoad.otherUserId}/message`), payLoad.message)

            get(dbRef(db, `users/${payLoad.myId}/alreadyMessaged`)).then(snapshot => {
                if (!snapshot.exists() || !snapshot.hasChild(payLoad.otherUserId)) {
                    set(dbRef(db, `users/${payLoad.myId}/alreadyMessaged/${payLoad.otherUserId}`), {
                        lastMessage: Date.now(),
                        id: payLoad.otherUserId,
                    });
                }

                if (snapshot.exists() && snapshot.hasChild(payLoad.otherUserId)) {
                    update(dbRef(db, `users/${payLoad.myId}/alreadyMessaged/${payLoad.otherUserId}`), {
                        lastMessage: Date.now()
                    })
                }
            });

            payLoad.message.from = 'otherUser'

            push(dbRef(db, `messages/${payLoad.otherUserId}/${payLoad.myId}/message`), payLoad.message)

            get(dbRef(db, `users/${payLoad.otherUserId}/alreadyMessaged`)).then(snapshot => {
                if (!snapshot.exists() || !snapshot.hasChild(payLoad.myId)) {
                    set(dbRef(db, `users/${payLoad.otherUserId}/alreadyMessaged/${payLoad.myId}`), {
                        lastMessage: Date.now(),
                        id: payLoad.myId,
                    });
                }

                if (snapshot.exists() && snapshot.hasChild(payLoad.myId)) {
                    update(dbRef(db, `users/${payLoad.otherUserId}/alreadyMessaged/${payLoad.myId}`), {
                        lastMessage: Date.now()
                    })
                }
            });
        }

    }

    let messagesRef
    const firebaseGetMessages = (payLoad) => {
        messagesRef = dbRef(db, `messages/${payLoad.myId}/${payLoad.otherUserId}/message`)

        onChildAdded(messagesRef, snapshot => {
            messages.value[snapshot.key] = snapshot.val()
        })
    }

    const firebaseClearMessages = () => {
        messages.value = {}
        messagesInfo.value = {}
        if (messagesRef) {
            off(messagesRef, 'child_added');
        }
    }

    const firebaseUpdateTyping = (payLoad) => {

        get(dbRef(db, `messages/${payLoad.myId}/${payLoad.otherUserId}`)).then(snapshot => {
            if (snapshot.exists() && payLoad.myId != undefined && payLoad.otherUserId != undefined) {
                update(dbRef(db, `messages/${payLoad.myId}/${payLoad.otherUserId}`), {
                    isTyping: payLoad.updates.isTyping
                })
            } else if (!snapshot.exists()) {
                set(dbRef(db, `messages/${payLoad.myId}/${payLoad.otherUserId}`), {
                    isTyping: payLoad.updates.isTyping,
                    notifications: 1,
                })
            }
        })
    }

    const firebaseGetUpdateTyping = (payLoad) => {
        onChildAdded(dbRef(db, `messages/${payLoad.otherUserId}/${payLoad.myId}`), snapshot => {
            if (snapshot.key == 'isTyping') {
                messagesInfo.value.isTyping = snapshot.val()
            } else if (snapshot.key == 'notifications') {
                messagesInfo.value.notifications = snapshot.val()
            }
        })

        onChildChanged(dbRef(db, `messages/${payLoad.otherUserId}/${payLoad.myId}`), snapshot => {
            if (snapshot.key == 'isTyping') {
                messagesInfo.value.isTyping = snapshot.val()
            } else if (snapshot.key == 'notifications') {
                messagesInfo.value.notifications = snapshot.val()
            }
        })
    }

    return {
        messages,
        messagesInfo,
        firebaseSendMessage,
        firebaseGetMessages,
        firebaseClearMessages,
        firebaseUpdateTyping,
        firebaseGetUpdateTyping,
    }
});
