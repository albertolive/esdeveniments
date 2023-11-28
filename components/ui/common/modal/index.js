import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ArrowLeftIcon from "@heroicons/react/outline/ArrowLeftIcon";

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
        <div className="h-full flex items-center justify-center">
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
              <Dialog.Panel className="w-full h-full flex flex-col justify-start md:justify-center items-center p-2">
                <Dialog.Title
                  as="h3"
                  className="w-full bg-whiteCorp flex fixed top-0 z-50 p-6 font-semibold"
                >
                  <div className="w-full flex justify-center items-center">
                    <button
                      ref={cancelButtonRef}
                      onClick={() => setOpen(false)}
                      className="w-1/12 focus:outline-none"
                    >
                      <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="w-11/12 flex justify-center">
                      <h3 className="text-center uppercase italic">{title}</h3>
                    </div>
                  </div>
                </Dialog.Title>
                <div className="w-full md:w-2/3 lg:w-1/3 flex justify-center items-start px-0 md:px-8 pt-8 md:py-8 overflow-auto">{children}</div>
                {actionButton && (
                  <div className="w-full bg-whiteCorp fixed z-900 bottom-0 left-0 p-3">
                    <div
                      className="flex justify-center"
                      style={{ position: "sticky", bottom: 0 }}
                    >
                      <button
                        onClick={() => setOpen(false)}
                        className="text-whiteCorp bg-primary rounded-xl py-3 px-6 ease-in-out duration-300 border border-whiteCorp focus:outline-none font-barlow italic uppercase font-semibold tracking-wide"
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
