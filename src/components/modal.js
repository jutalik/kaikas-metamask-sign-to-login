import Modal from "react-modal";
import React, { useState } from "react";
import KaikasBtn from "./kaikas";
import MetaMaskBtn from "./metamask";

const _Modal = (props) => {
  Modal.setAppElement(document.getElementById("root"));
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      display: "flex",
      width: "300px",
      height: "300px",
      flexDirection: "column",
      alignItems: "center",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <>
      <button onClick={openModal}>loggin</button>

      <Modal
        isOpen={modalIsOpen}
        //   onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <KaikasBtn />
        <MetaMaskBtn />
      </Modal>
    </>
  );
};

export default _Modal;
