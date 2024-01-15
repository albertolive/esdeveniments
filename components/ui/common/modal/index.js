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
      <div
        className="w-full bg-bColor opacity-60 fixed inset-0"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div className="w-full fixed inset-0 overflow-y-auto">
        <div className="w-full flex items-center justify-center">
          <Transition.Root show={open} as={Fragment}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-70"
              leave="ease-in duration-200"
              leaveFrom="opacity-70"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="flex flex-col justify-center items-center">
                <Dialog.Title
                  as="h3"
                  className="w-full bg-whiteCorp flex fixed top-0 z-50 p-2 font-semibold"
                >
                  <div className="w-full flex justify-center items-center">
                    <button
                      ref={cancelButtonRef}
                      onClick={() => setOpen(false)}
                      className="fixed top-0 left-0 p-3 focus:outline-none"
                    >
                      <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="w-full flex justify-center">
                      <p className="text-center font-barlow uppercase italic">
                        {title}
                      </p>
                    </div>
                  </div>
                </Dialog.Title>
                <div className="w-full h-screen flex justify-center items-center sm:w-[500px] bg-whiteCorp rounded-lg shadow-xl p-4">
                  {children}
                </div>
                {actionButton && (
                  <div className="w-full h-full flex justify-center items-end fixed z-10 bottom-0 left-0 p-8">
                    <div
                      className="flex justify-center"
                      style={{ position: "sticky", bottom: 0 }}
                    >
                      <button
                        onClick={() => setOpen(false)}
                        className="flex justify-center items-center gap-2 text-blackCorp bg-whiteCorp rounded-xl py-2 px-3 ease-in-out duration-300 border border-darkCorp font-barlow italic uppercase font-semibold tracking-wide focus:outline-none hover:bg-primary hover:border-whiteCorp hover:text-whiteCorp"
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
