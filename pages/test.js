import { useState } from "react";

const CustomRecurrence = () => {
    const [showRecurrence, setShowRecurrence] = useState(false);
    const [repeatEvery, setRepeatEvery] = useState(1);
    const [repeatUnit, setRepeatUnit] = useState("day");
    const [repeatEnd, setRepeatEnd] = useState("never");

    const toggleRecurrence = () => {
        setShowRecurrence(!showRecurrence);
    };

    const handleRepeatEveryChange = (e) => {
        setRepeatEvery(e.target.value);
    };

    const handleRepeatUnitChange = (e) => {
        setRepeatUnit(e.target.value);
    };

    const handleRepeatEndChange = (e) => {
        setRepeatEnd(e.target.value);
    };

    return (
        <div className="mt-2">
            <button
                type="button"
                onClick={toggleRecurrence}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-500"
            >
                <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M15.999 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm2-2a6 6 0 1 0-12 0 6 6 0 0 0 12 0zm-2-2a8 8 0 1 1-16 0 8 8 0 0 1 16 0z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                Custom
            </button>
            {showRecurrence && (
                <div className="mt-4">
                    <div className="flex items-center mb-2">
                        <input
                            type="number"
                            min="1"
                            value={repeatEvery}
                            onChange={handleRepeatEveryChange}
                            className="w-16 p-2 mr-2 border border-gray-300 rounded-md appearance-none"
                        />
                        <select
                            value={repeatUnit}
                            onChange={handleRepeatUnitChange}
                            className="w-32 p-2 border border-gray-300 rounded-md appearance-none"
                        >
                            <option value="day">Day(s)</option>
                            <option value="week">Week(s)</option>
                            <option value="month">Month(s)</option>
                            <option value="year">Year(s)</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span>Repeat Ends:</span>
                        <select
                            value={repeatEnd}
                            onChange={handleRepeatEndChange}
                            className="w-48 p-2 ml-2 border border-gray-300 rounded-md appearance-none"
                        >
                            <option value="never">Never</option>
                            <option value="after">After...</option>
                            <option value="on">On...</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomRecurrence;
