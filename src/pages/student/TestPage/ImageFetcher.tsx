import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../services/firebaseConfig";

interface ImageFetcherProps {
  filename: string;
  userEmail: string;
  testCode: string;
}

const ImageFetcher: React.FC<ImageFetcherProps> = ({
  filename,
  userEmail,
  testCode,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (filename && userEmail && testCode) {
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `${userEmail}/${testCode}/${filename}`);

      // Get the download URL
      getDownloadURL(storageRef)
        .then((url) => {
          // Set the download URL to the imageSrc state
          setImageSrc(url);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  }, [filename, userEmail, testCode]);

  return (
    <div className="my-4">
      {imageSrc ? (
        <img src={imageSrc} alt="Fetched from Firebase" />
      ) : (
        <p>Kraunasi paveiksliukas...</p>
      )}
    </div>
  );
};

export default ImageFetcher;
