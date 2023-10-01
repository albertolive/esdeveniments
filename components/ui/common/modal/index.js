import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import XIcon from "@heroicons/react/outline/XIcon";

export default function Modal({ open, setOpen, title, children }) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
        static
      >
        <div className="flex items-center justify-center min-h-screen z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-whiteCorp" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* la prop fixed fa que el contingut estigui a dalt */}
            <div className="bg-whiteCorp w-full h-full overflow-auto z-50 fixed">
              <div className="px-4 pt-2 pb-4">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900 flex flex-col"
                >
                  <div className="justify-between flex-row items-center flex">
                    <h2>{title}</h2>
                    <div className="justify-end pt-2 pr-2">
                      <button
                        ref={cancelButtonRef}
                        onClick={() => setOpen(false)}
                        className="focus:outline-none"
                      >
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </Dialog.Title>
                <div className="mt-2">{children}</div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
