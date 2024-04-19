import { List } from "antd";
import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import User from "./User";
export default function UserList({
    filteredUsers,
    users,
    userRecord,
    setUserSelected,
    setIsAdd,
    setIsUserModalOpen,
    showDrinkModal,
    drinks,
}) {
    /** Get the id of the user and set it as selected user */

    return (
        <Container>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0, 0.71, 0.2, 1.01],
                }}
            >
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={
                        filteredUsers.length !== 0
                            ? filteredUsers
                            : users
                    }
                    renderItem={(userRecord) => (
                        <User
                            userRecord={userRecord}
                            setUserSelected={setUserSelected}
                            setIsAdd={setIsAdd}
                            setIsUserModalOpen={setIsUserModalOpen}
                            showDrinkModal={showDrinkModal}
                            drinks={drinks}
                        />
                    )}
                />
            </motion.div>
        </Container>
    );
}
