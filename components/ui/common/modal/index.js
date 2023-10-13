import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import XIcon from "@heroicons/react/outline/XIcon";

export default function Modal({
  open,
  setOpen,
  title,
  children,
  actionButton,
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="fixed inset-0 z-50 overflow-y-auto"
      initialFocus={cancelButtonRef}
    >
      <div className="fixed inset-0 bg-whiteCorp" aria-hidden="true" />
      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <Transition.Root show={open} as={Fragment}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="mx-auto w-full max-w-full rounded bg-white">
                <Dialog.Title
                  as="h3"
                  className="bg-whiteCorp text-lg leading-6 font-medium text-gray-900 flex flex-col sticky top-0 bg-white p-2 ml-2"
                  style={{ position: "sticky", top: 0 }}
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
                <div className="m-4 overflow-auto">{children}</div>
                {actionButton && (
                  <div className="sticky bottom-0 bg-whiteCorp p-2">
                    <div
                      className="p-2 bg-primary rounded-md"
                      style={{ position: "sticky", bottom: 0 }}
                    >
                      <button
                        onClick={() => setOpen(false)}
                        className="w-full px-4 bg-blue-500 text-white font-bold  text-whiteCorp"
                      >
                        {actionButton}
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </Transition.Root>
        </div>
      </div>
    </Dialog>
  );
}
