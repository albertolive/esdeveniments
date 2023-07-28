import Link from "next/link";
import Modal from "@components/ui/common/modal";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import XCircleIcon from "@heroicons/react/outline/XCircleIcon";

export default function EditModal({
  openModal,
  setOpenModal,
  slug,
  setOpenModalDeleteReasonModal,
  openDeleteReasonModal,
  setReasonToDelete,
  reasonToDelete,
  onSendDeleteReason,
  onRemove,
}) {
  return (
    <>
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        title="Suggereix una edició"
      >
        <ul role="list" className="divide-y divide-gray-200 text-left">
          <li key="edit" className="py-4 flex">
            <Link href={`/e/${slug}/edita`} prefetch={false}>
              <a>
                <div className="flex items-center">
                  <PencilIcon
                    className="h-7 w-7 text-[#ECB84A] text-xs"
                    aria-hidden="true"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Canvia el títol o altres detalls
                    </p>
                    <p className="text-sm text-gray-500">
                      Edita el títol, la ubicació, l&apos;horari, etc.
                    </p>
                  </div>
                </div>
              </a>
            </Link>
          </li>
          <li key="remove" className="py-4 flex">
            <div className="cursor-pointer" as="button" onClick={onRemove}>
              <div className="flex items-center">
                <XCircleIcon
                  className="h-7 w-7 text-[#ECB84A] text-xs"
                  aria-hidden="true"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Eliminar</p>
                  <p className="text-sm text-gray-500">
                    L&apos;esdeveniment no existeix, està duplicat, etc.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </Modal>
      <Modal
        open={openDeleteReasonModal}
        setOpen={setOpenModalDeleteReasonModal}
        title="Suggereix una el·liminació"
      >
        <>
          <div className="text-sm font-medium text-gray-900">
            Motiu de l&apos;el·liminació suggerida
          </div>
          <fieldset className="space-y-5">
            <legend className="sr-only">Sol·licitud d&apos;eliminació</legend>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="not-exist"
                  checked={reasonToDelete === "not-exist"}
                  onChange={() => setReasonToDelete("not-exist")}
                  aria-describedby="not-exist-description"
                  name="not-exist"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="not-exist"
                  className="font-medium text-gray-700"
                >
                  No existeix
                </label>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="duplicated"
                  checked={reasonToDelete === "duplicated"}
                  onChange={() => setReasonToDelete("duplicated")}
                  aria-describedby="duplicated-description"
                  name="duplicated"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="duplicated"
                  className="font-medium text-gray-700"
                >
                  Duplicat
                </label>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="offensive"
                  checked={reasonToDelete === "offensive"}
                  onChange={() => setReasonToDelete("offensive")}
                  aria-describedby="offensive-description"
                  name="offensive"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="offensive"
                  className="font-medium text-gray-700"
                >
                  Ofensiu, nociu o enganyós
                </label>
              </div>
            </div>
            <div className="relative flex items-start text-left">
              <div className="flex items-center h-5">
                <input
                  id="others"
                  checked={reasonToDelete === "others"}
                  onChange={() => setReasonToDelete("others")}
                  aria-describedby="others-description"
                  name="others"
                  type="checkbox"
                  className="focus:outline-none h-4 w-4 text-[#ECB84A] border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="others" className="font-medium text-gray-700">
                  Altres
                </label>
                <p id="offers-description" className="text-gray-500">
                  Envieu un correu amb el motiu a:{" "}
                  <a
                    className="hover:text-[#ECB84A]"
                    href="mailto:hola@esdeveniments.cat"
                  >
                    hola@esdeveniments.cat
                  </a>
                </p>
              </div>
            </div>
          </fieldset>
          <div className="flex mt-3 justify-end">
            <button
              disabled={!reasonToDelete}
              onClick={onSendDeleteReason}
              className="disabled:opacity-50 disabled:cursor-default disabled:hover:bg-[#ECB84A] ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ECB84A] hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
            >
              Enviar
            </button>
          </div>
        </>
      </Modal>
    </>
  );
}
