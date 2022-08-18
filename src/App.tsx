import moment from "moment";
import { useEffect, useState } from "react";
import { PrizesBox } from "./components/PrizesBox";
import { IRecordedPrize, RecordsTable } from "./components/RecordsTable";
import { invoke } from "@tauri-apps/api";

export interface IPrize {
  color: String;
  name: String;
}
// const exampleData: Array<IRecordedPrize> = [
//   {
//     person: "Ryjek",
//     name: "Robux",
//     dateUni: moment.now(),
//     ammount: 1,
//   },
//   {
//     person: "Oskar",
//     name: "Robux chyba",
//     dateUni: moment.now(),
//     ammount: 2,
//   },
//   {
//     person: "Dave",
//     name: "Happy Meal",
//     dateUni: moment.now(),
//     ammount: 3,
//   },
// ];

function App() {
  const [userName, setUserName] = useState<string>("");
  const [prizeAmmount, setPrizeAmmount] = useState<number>(0);
  const [filter, setFilter] = useState("");
  const [selectedPrize, setSelectedPrize] = useState<number>(-1);
  const [records, setRecords] = useState<Array<IRecordedPrize>>([]);
  const [prizes, setPrizes] = useState<Array<IPrize>>([
    // {
    //   color: "red",
    //   name: "Robux",
    // },
    // {
    //   color: "yellow",
    //   name: "Happy Meal",
    // },
    // {
    //   color: "blue",
    //   name: "Robux chyba",
    // },
  ]);
  const [addPrizeOverlay, setAddPrizeOverlay] = useState<boolean>(false);
  const [colorToAdd, setcolorToAdd] = useState<string>("");
  const [prizeNameToAdd, setPrizeNameToAdd] = useState<string>("");

  const handleSubmit = async () => {
    console.log(userName, prizeAmmount, selectedPrize);
    if (userName.length <= 0 || selectedPrize < 0 || selectedPrize > prizes.length) {
      return alert(`error accourred when adding record`);
    }
    const newRecords = [
      ...records,
      { ammount: prizeAmmount, dateUni: moment.now(), name: prizes[selectedPrize].name, person: userName },
    ];
    try {
      const data = await invoke("save_json", { json: JSON.stringify(newRecords), path: "../records.json" });
      if (data == "ok") {
        setRecords(newRecords);
      } else {
        alert(`error accoured when saving record to database`);
      }
    } catch (error) {
      alert(`invoke error: ${error}`);
    }
  };
  const handleAddPrize = async () => {
    if (colorToAdd.length > 0 && prizeNameToAdd.length > 0) {
      const newPrizes = [...prizes, { color: colorToAdd, name: prizeNameToAdd }];

      setAddPrizeOverlay(false);
      try {
        const data = await invoke("save_json", { json: JSON.stringify(newPrizes), path: "../prizes.json" });
        if (data == "ok") {
          setPrizes(newPrizes);
        } else {
          alert(`error accoured when saving prize to database`);
        }
      } catch (error) {
        alert(`invoke error: ${error}`);
      }
      setcolorToAdd("");
      setPrizeNameToAdd("");
    } else alert(`one or more inputs are empty`);
  };

  useEffect(() => {
    invoke("read_json", { path: "../prizes.json" })
      .then((data) => JSON.parse(data as string))
      .then((json) => setPrizes(json))
      .catch((err) => alert(err));
    invoke("read_json", { path: "../records.json" })
      .then((data) => JSON.parse(data as string))
      .then((json) => setRecords(json))
      .catch((err) => alert(err));
  }, []);

  return (
    <div className="dark:bg-gray-800 w-full h-screen">
      <header>
        <h1 className="pt-8 text-6xl p-4 text-center w-full dark:text-gray-200">Whom do I Owe</h1>
      </header>
      <main className="flex justify-center align-center">
        <section className="sections p-4 flex border-r-2 relative dark:border-r-neutral-300 ">
          <article className="h-96 max-h-96 w-full flex">
            <PrizesBox
              selectedPrize={selectedPrize}
              setSelectedPrize={setSelectedPrize}
              prizes={prizes}
              setPrizes={() => setPrizes}
              setAddPrizeOverlay={setAddPrizeOverlay}
            />
            <div className="w-1/3 p-2">
              <h2 className="w-full text-3xl dark:text-gray-400 text-center">Osoba</h2>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                className="w-full input"
              />
              <input
                value={prizeAmmount}
                onChange={(e) => setPrizeAmmount(parseInt(e.target.value))}
                type="number"
                className="w-full mt-4 input"
              />
              {prizes.length > 0 && (
                <button onClick={() => handleSubmit()} className="w-1/4 absolute bottom-[35px] right-[15px] button">
                  Add
                </button>
              )}
            </div>
          </article>
        </section>
        <section className="sections p-5 flex flex-col">
          <RecordsTable records={records} prizes={prizes} filter={filter} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            type="text"
            placeholder="Search"
            className="mt-3 input"
          />
        </section>
      </main>
      {addPrizeOverlay && (
        <article className="overlay-wrapper">
          <section>
            <div className="overlay">
              <h1 className="text-3xl basis-1/4">Add Prize</h1>
              <input
                value={prizeNameToAdd}
                onChange={(e) => setPrizeNameToAdd(e.target.value)}
                type="text"
                className="input"
                placeholder="Prize Name"
              />
              <input
                value={colorToAdd}
                onChange={(e) => setcolorToAdd(e.target.value)}
                type="text"
                className="input mt-3 mb-3"
                placeholder="Color"
              />
              <button onClick={() => handleAddPrize()} className="button w-1/4">
                Add
              </button>
              <div onClick={() => setAddPrizeOverlay(false)} className="cancel"></div>
            </div>
          </section>
        </article>
      )}
    </div>
  );
}

export default App;
