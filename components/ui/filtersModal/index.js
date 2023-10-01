import { useState } from "react";
import Link from "next/link";
import Modal from "@components/ui/common/modal";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import XCircleIcon from "@heroicons/react/outline/XCircleIcon";
import { BYDATES } from "@utils/constants";

export default function FiltersModal({ openModal, setOpenModal, slug }) {
  const [followedOrgs, setFollowedOrgs] = useState(false);
  const [onlineEvents, setOnlineEvents] = useState(false);
  const [date, setDate] = useState("today");
  const [price, setPrice] = useState("free");
  const [category, setCategory] = useState("business");
  return (
    <>
      <Modal open={openModal} setOpen={setOpenModal} title="Filtres">
        <div className="space-y-8">
          <fieldset className="pt-4 pb-2">
            <legend className="text-sm font-medium">Data</legend>
            <div className="mt-3 space-y-3">
              <div className="flex flex-col">
                {BYDATES.map(({ value, label }) => (
                  <div key={value} className="flex pb-4">
                    <input
                      id="dateToday"
                      name="date"
                      type="radio"
                      className="form-radio h-5 w-5"
                      checked={date === value}
                      onChange={() => setDate(value)}
                    />
                    <label htmlFor="dateToday" className="ml-3 text-sm">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset className="pt-4 pb-2">
            <legend className="text-sm font-medium">Categories</legend>

            <div className="mt-3 space-y-3">
              <div className="flex items-center">
                <input
                  id="categoryBusiness"
                  name="category"
                  type="radio"
                  className="form-radio h-5 w-5"
                  checked={category === "business"}
                  onChange={() => setCategory("business")}
                />
                <label htmlFor="categoryBusiness" className="ml-3 text-sm">
                  Business
                </label>
              </div>

              {/* more options */}
            </div>
          </fieldset>

          {/* More filters */}
        </div>
      </Modal>
    </>
  );
}
