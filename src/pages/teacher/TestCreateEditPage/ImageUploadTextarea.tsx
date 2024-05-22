import React, { useState, useRef, useEffect } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { storage } from "../../../services/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { useAuth } from "../../../context/AuthContext";

interface ImageUploadTextareaProps {
  textareaContent: string;
  setTextareaContent: (text: string) => void;
  imageFilenameInQ: string | null;
  setImageFilenameInQ: (imageFilename: string) => void;
  testCode: string | undefined;
}

const ImageUploadTextarea: React.FC<ImageUploadTextareaProps> = ({
  textareaContent,
  setTextareaContent,
  testCode,
  imageFilenameInQ,
  setImageFilenameInQ,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageFilename, setImageFilename] = useState<string | null>(
    imageFilenameInQ
  );

  const { currentUser } = useAuth();

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData) {
        const items = e.clipboardData.items;
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              handleUploadImage(file);
            }
          }
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("paste", handlePaste);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("paste", handlePaste);
      }
    };
  }, []);

  useEffect(() => {
    if (imageFilenameInQ) {
      const storageRef = ref(
        storage,
        `${currentUser?.email}/${testCode}/${imageFilenameInQ}`
      );
      getDownloadURL(storageRef).then((url) => {
        setImageSrc(url);
      });
    }
  }, [imageFilenameInQ]);

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUploadImage(file);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaContent(e.target.value);
  };

  const handleRemoveImage = () => {
    deleteObject(
      ref(storage, `${currentUser?.email}/${testCode}/${imageFilename}`)
    )
      .then(() => {
        setImageFilenameInQ("");
        setImageSrc(null);
        setImageFilename(null);
      })
      .catch((error) => {
        console.error("Uh-oh, an error occurred!", error);
      });
  };

  const handleUploadImage = (file: File) => {
    const fileExtension = file.name.split(".").pop();
    const randomFilename: string = generateGUID() + "." + fileExtension;

    const reader = new FileReader();
    reader.onload = () => {
      // Upload the image to Firebase Storage
      const storageRef = ref(
        storage,
        `${currentUser?.email}/${testCode}/${randomFilename}`
      );
      uploadString(storageRef, reader.result as string, "data_url")
        .then((snapshot) => {
          console.log("Uploaded a data_url string!", snapshot);
          // update realtime db
          setImageFilenameInQ(randomFilename);
          setImageFilename(randomFilename);
        })
        .catch((error) => {
          console.error("Upload failed", error);
        });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <textarea
        name="question"
        ref={textareaRef}
        value={textareaContent}
        onChange={handleTextareaChange}
        placeholder="Čia nutempkite arba įklijuokite paveikslėlį, rašykite tekstą arba palikite laukelį tuščią... "
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: isDragging ? "#e0f7fa" : "white",
        }}
      ></textarea>
      {imageSrc && (
        <div style={{ marginTop: "10px", position: "relative" }}>
          <img src={imageSrc} alt="Uploaded" style={{ maxWidth: "100%" }} />
          <button
            title="Ištrinti paveikslėlį"
            onClick={handleRemoveImage}
            className="absolute top-[-25px] right-[-15px] w-10 h-10 p-2 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <RiDeleteBin5Fill className="w-full h-full p-0 m-0" />
          </button>
        </div>
      )}
    </div>
  );
};

function generateGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default ImageUploadTextarea;
