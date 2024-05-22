import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database, storage } from "../../../services/firebaseConfig";
import { get, onValue, push, ref, remove, set } from "firebase/database";
import {
  ref as storageRef,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { UserData } from "../../../utils/TYPES";
import "./index.css";
import { useAuth } from "../../../context/AuthContext";
import TestCard from "./TestCard";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [testList, setTestList] = useState<UserData["tests"]>({});
  const [sortedKeys, setSortedKeys] = useState<string[]>([]);
  const [usedTestCodes, setUsedTestCodes] = useState<string[]>([]);
  const { currentUser } = useAuth();

  const regex = /^[a-zA-Z]*$/;
  const [newTestCode, setNewTestCode] = useState<string>("");

  useEffect(() => {
    const emailRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/writerEmail"
    );
    set(emailRef, currentUser?.email);
  }, []);

  useEffect(() => {
    if (testList && sortedKeys.length === 0) {
      const sortedList = Object.keys(testList).sort(
        (a, b) =>
          new Date(testList[b].lastModified).getTime() -
          new Date(testList[a].lastModified).getTime()
      );
      setSortedKeys(sortedList);
    }
  }, [testList]);

  useEffect(() => {
    const userTestsRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests"
    );
    onValue(userTestsRef, (snapshot) => {
      const data = snapshot.val();
      setTestList(data || {});
    });

    const testCodesInUseRef = ref(database, "testCodesInUse");
    onValue(testCodesInUseRef, (snapshot) => {
      const data = snapshot.val();
      setUsedTestCodes(data || []);
    });
  }, [navigate]);

  const makeTestPublic = (testId: string) => {
    if (!testList[testId]) {
      alert("Klaida: testas nerastas");
      throw new Error(`Test with id ${testId} does not exist in testList.`);
    }

    const test = testList[testId];
    const filteredTestInfo = {
      writerEmail: currentUser?.email,
      description: test.test.description || "",
      title: test.test.title || "???",
      questions: test.test.questions.map((question) => ({
        isAdditional: question.isAdditional,
        number: question.number || "???",
        points: question.points,
        question: question.question || "",
        imageFilename: question.imageFilename || null,
      })),
      specialSymbols: test.test.specialSymbols || "",
    };

    const accessibleTestsRef = ref(database, `accessibleTests/${testId}`);

    set(accessibleTestsRef, filteredTestInfo)
      .then(() => {
        set(
          ref(
            database,
            "users/" +
              currentUser?.email?.replace(/\./g, "?") +
              "/tests/" +
              testId +
              "/test/isTestAccessible"
          ),
          true
        );
        set(
          ref(
            database,
            "users/" +
              currentUser?.email?.replace(/\./g, "?") +
              "/tests/" +
              testId +
              "/lastModified"
          ),
          new Date().toISOString()
        )
          .then(() => {
            if (ref(database, "execution/" + testId)) {
              set(
                ref(database, "execution/" + testId + "/readerEmail"),
                currentUser?.email
              )
                .then(() => {
                  get(ref(database, "execution/" + testId)).then((snapshot) => {
                    if (!snapshot.exists() || !snapshot.val()) {
                      push(
                        ref(database, "execution/" + testId + "/responses"),
                        {
                          studentId: "testas paviešintas",
                          timestamp: new Date().toISOString(),
                        }
                      );
                      push(
                        ref(
                          database,
                          "execution/" + testId + "/fullscreenExits"
                        ),
                        {
                          studentId: "testas paviešintas",
                          timestamp: new Date().toISOString(),
                        }
                      );
                      push(ref(database, "execution/" + testId + "/feedback"), {
                        studentId: "testas paviešintas",
                        timestamp: new Date().toISOString(),
                      });
                    }
                  });
                })
                .catch((error) => {
                  console.error("Error updating execution: ", error);
                  alert("Klaida: " + error.message);
                });
            }
          })
          .catch((error) => {
            console.error("Error updating lastModified: ", error);
            alert("Klaida: " + error.message);
          });
      })
      .catch((error) => {
        console.error("Error publishing test: ", error);
        alert("Klaida: " + error.message);
      });
  };

  const makeTestPrivate = (testId: string) => {
    if (!testList[testId]) {
      alert("Klaida: testas nerastas");
      throw new Error(`Test with id ${testId} does not exist in testList.`);
    }

    if (
      !confirm(
        "Ar tikrai norite užprivatinti šį testą? Mokiniams, šiuo metu rašantiems testą, bus uždrausta jį toliau rašyti, nepateikti atsakymai bus ištrinti."
      )
    )
      return;

    remove(ref(database, "accessibleTests/" + testId))
      .then(() => {
        set(
          ref(
            database,
            "users/" +
              currentUser?.email?.replace(/\./g, "?") +
              "/tests/" +
              testId +
              "/test/isTestAccessible"
          ),
          false
        );
        set(
          ref(
            database,
            "users/" +
              currentUser?.email?.replace(/\./g, "?") +
              "/tests/" +
              testId +
              "/lastModified"
          ),
          new Date().toISOString()
        );
      })
      .catch((error) => {
        console.error("Error privating test: ", error);
        alert("Klaida: " + error.message);
      });
  };

  const createNewTest = (testId: string) => {
    if (testId === "") {
      alert("Įveskite testo kodą");
      return;
    }
    if (usedTestCodes.includes(testId)) {
      alert("Toks testo kodas jau egzistuoja");
      return;
    }
    const newTestRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests/" + testId
    );

    set(newTestRef, {
      lastModified: new Date().toISOString(),
      test: {
        title: "Naujas testas",
        isTestAccessible: false,
        questions: [
          {
            number: "1.",
            question: "",
            correctAnswer: "",
            points: 1,
            isAdditional: false,
          },
        ],
      },
    })
      .then(() => {
        set(ref(database, "testCodesInUse"), [...usedTestCodes, testId])
          .then(() => navigate(`/test-create-edit/${testId}`))
          .catch((error) => {
            console.error("Error updating testCodesInUse: ", error);
            alert("Klaida: " + error.message);
          });
      })
      .catch((error) => {
        console.error("Error creating new test: ", error);
        alert("Klaida: " + error.message);
      });
  };

  const deleteFolder = async (folderPath: string) => {
    const folderRef = storageRef(storage, folderPath);

    try {
      const listResult = await listAll(folderRef);

      // Create a promise for each file to delete
      const deletePromises = listResult.items.map((fileRef) =>
        deleteObject(fileRef)
      );

      // Wait for all files to be deleted
      await Promise.all(deletePromises);

      console.log("Folder and all files deleted successfully!");
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder");
    }
  };

  const deleteTest = (testId: string) => {
    if (
      confirm(
        "Ar tikrai norite ištrinti šį testą su VISAIS jo duomenimis (užduotys, mokinių atsakymai, įvertinimai)?\nVEIKSMAS NEGRĮŽTAMAS!!!"
      )
    ) {
      remove(
        ref(
          database,
          "users/" +
            currentUser?.email?.replace(/\./g, "?") +
            "/tests/" +
            testId
        )
      );
      remove(ref(database, "accessibleTests/" + testId));
      remove(ref(database, "execution/" + testId));
      remove(ref(database, "accessibleGrades/" + testId));
      const testCodesInUseRef = ref(database, "testCodesInUse");
      get(testCodesInUseRef).then((snapshot) => {
        const data = snapshot.val();
        const filteredData = data.filter((code: string) => code !== testId);
        set(testCodesInUseRef, filteredData);
      });
      deleteFolder(`${currentUser?.email}/${testId}`).then(() => {
        alert("Sėkmingai ištrintas testas su kodu " + testId);
      });
    }
  };

  async function copyFolder(sourceFolder: string, destinationFolder: string) {
    const sourceRef = storageRef(storage, sourceFolder);

    try {
      const listResult = await listAll(sourceRef);

      for (const item of listResult.items) {
        const itemName = item.name;
        const destinationRef = storageRef(
          storage,
          `${destinationFolder}/${itemName}`
        );

        // Get the download URL for the current item
        const downloadURL = await getDownloadURL(item);

        // Fetch the file content
        const response = await fetch(downloadURL);
        const blob = await response.blob();

        // Upload the file to the new location
        await uploadBytes(destinationRef, blob);
        console.log(`Copied ${itemName} to ${destinationFolder}`);
      }

      console.log("Folder copied successfully!");
    } catch (error) {
      console.error("Error copying folder:", error);
    }
  }

  const copyTest = (testId: string) => {
    const newCode = prompt(
      "Įveskite testo kopijos kodą (NEBUS GALIMA KEISTI!).\nKopijuojama tik užduotys (be mokinių sprendimų), gali tekti luktelti, kol nusikopijuos paveikslėlių failai.\nTesto kodą veskite didžiosiomis raidėmis!",
      testId + "COPY"
    );

    if (newCode === null) return;
    if (usedTestCodes.includes(newCode)) {
      alert("Toks testo kodas jau egzistuoja");
      return;
    }
    if (!/^[A-Z]+$/.test(newCode)) {
      alert("Prašome įvesti tik didžiąsias raides!");
      return;
    }
    const newTestRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests/" + newCode
    );
    get(
      ref(
        database,
        "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests/" + testId
      )
    ).then((snapshot) => {
      const data = snapshot.val();
      set(newTestRef, {
        lastModified: new Date().toISOString(),
        test: {
          title: data.test.title + " KOPIJA",
          isTestAccessible: false,
          questions: data.test.questions,
          description: data.test.description,
          specialSymbols: data.test.specialSymbols,
        },
      })
        .then(() => {
          set(ref(database, "testCodesInUse"), [...usedTestCodes, newCode])
            .then(() => {
              copyFolder(
                `${currentUser?.email}/${testId}`,
                `${currentUser?.email}/${newCode}`
              )
                .then(() => {
                  navigate(`/test-create-edit/${newCode}`);
                })
                .catch((error) => {
                  console.error("Error copying folder: ", error);
                  alert("Klaida: " + error.message);
                });
            })
            .catch((error) => {
              console.error("Error updating testCodesInUse: ", error);
              alert("Klaida: " + error.message);
            });
        })
        .catch((error) => {
          console.error("Error creating new test: ", error);
          alert("Klaida: " + error.message);
        });
    });
  };

  return (
    <div className="view-page-container">
      <div className="flex mt-4 mb-12">
        <div className="w-3/12">
          <button
            className="bg-green-600 hover:bg-green-800"
            onClick={() => navigate("/export")}
          >
            Duomenų eksportas
          </button>
        </div>
        <div className="w-6/12">
          <h1>Mokytojo aplinka</h1>
        </div>
        <div className="w-3/12">
          <div className="text-xl">{currentUser?.email || "Kraunasi..."}</div>
          <button className="logout-btn" onClick={() => navigate("/logout")}>
            Atsijungti
          </button>
        </div>
      </div>

      <div className="dashboard-test-list">
        <div className="test-list-item new-test-item">
          <div className="test-title">Kurti naują testą</div>
          <p className="text-left">Testo kodo nebus galima keisti!</p>
          <input
            type="text"
            placeholder="Įveskite naujo testo kodą"
            value={newTestCode}
            onChange={(e) => {
              if (regex.test(e.target.value)) {
                setNewTestCode(e.target.value.toUpperCase());
              }
            }}
          />
          <button onClick={() => createNewTest(newTestCode)}>
            Kurti testą
          </button>
        </div>
        {testList &&
          sortedKeys.map((key) => {
            if (testList[key]) {
              return (
                <TestCard
                  key={key}
                  testCode={key}
                  test={testList[key]}
                  makeTestPrivate={makeTestPrivate}
                  makeTestPublic={makeTestPublic}
                  deleteTest={deleteTest}
                  copyTest={copyTest}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default DashboardPage;
