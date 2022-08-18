import moment from "moment";
import { useEffect, useState } from "react";
import { IPrize } from "../App";

export interface IRecordedPrize {
  dateUni: number;
  name: String;
  person: String;
  ammount: number;
}

interface IProps {
  prizes: IPrize[];
  filter: string;
  records: IRecordedPrize[];
}

export const RecordsTable: React.FC<IProps> = ({ prizes, filter, records }) => {
  const [displayedRecords, setDisplayedRecords] = useState<Array<IRecordedPrize>>(records);

  const applyFilter = () => {
    if (filter != "") {
      if (filter[0] == "@") {
        console.log("filter by name");
        let fixedFilter = filter.substring(1);
        setDisplayedRecords((prev) => {
          console.log(prev);
          return prev.filter((prevRecord) => {
            if (prevRecord.person.toLowerCase().includes(fixedFilter.toLowerCase())) return prevRecord;
          });
        });
      } else {
        console.log("filter by prize", filter);
        setDisplayedRecords((prev) => {
          console.log(prev);
          return prev.filter((prevRecord) => {
            if (prevRecord.name.toLowerCase().includes(filter.toLowerCase())) return prevRecord;
          });
        });
      }
    }
  };
  useEffect(() => {
    setDisplayedRecords(records);
    applyFilter();
  }, [filter, records]);

  return (
    <article className="w-full h-full max-h-[70vh] dark:bg-gray-900 overflow-y-scroll dark:text-white">
      <section className="flex py-2 text-center records-header font-bold flex-wrap w-full">
        <div className="basis-1/4 border-r-2">Name</div>
        <div className="basis-1/4">Prize</div>
        <div className="basis-1/4">Ammount</div>
        <div className="basis-1/4">Date</div>
      </section>
      {displayedRecords.map((e: IRecordedPrize) => {
        let selectedPrize = prizes.filter((prize) => {
          return prize.name == e.name && prize;
        })[0];
        let color: String = "white";
        if (selectedPrize) {
          color = selectedPrize.color;
        }
        return (
          <section style={{ color: `${color || "white"}` }} className="flex records text-center flex-wrap w-full">
            <div className="basis-1/4 border-r-2">{e.person}</div>
            <div className="basis-1/4">{e.name}</div>
            <div className="basis-1/4">{e.ammount}</div>
            <div className="basis-1/4">{moment(e.dateUni).format("DD-MM-YYYY")}</div>
          </section>
        );
      })}
    </article>
  );
};
