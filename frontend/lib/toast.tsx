"use client"

import type React from "react"
import { FaTimes, FaExclamationCircle, FaCheckCircle } from "react-icons/fa"
import toast from "react-hot-toast"

// Success Toast Component
const SuccessToastComponent = ({
  title,
  description,
  t,
}: {
  title: string
  description?: string
  t: any
}) => {
  return (
    <div
      className={`w-auto bg-white shadow-lg rounded-xl p-4 border-l-4 border-teal-500 ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <FaCheckCircle className="text-teal-500 h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-teal-800">{title}</h3>
            {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
          </div>
        </div>
        <button
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-full p-1 hover:bg-teal-50 transition-colors"
          onClick={() => toast.dismiss(t.id)}
        >
          <span className="sr-only">Close</span>
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Error Toast Component
const ErrorToastComponent = ({
  title,
  description,
  t,
}: {
  title: string
  description?: string
  t: any
}) => {
  return (
    <div
      className={`w-auto bg-white shadow-lg rounded-xl p-4 border-l-4 border-red-500 ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <FaExclamationCircle className="text-red-500 h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
            {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
          </div>
        </div>
        <button
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 hover:bg-red-50 transition-colors"
          onClick={() => toast.dismiss(t.id)}
        >
          <span className="sr-only">Close</span>
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Show Success Toast
export const showSuccessToast = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => {
  toast.custom((t) => <SuccessToastComponent t={t} title={title} description={description} />, {
    duration: 4000,
    position: "bottom-right",
  })
}

// Show Error Toast
export const showErrorToast = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => {
  toast.custom((t) => <ErrorToastComponent t={t} title={title} description={description} />, {
    duration: 5000,
    position: "bottom-right",
  })
}

// Info Toast Component
const InfoToastComponent = ({
  title,
  description,
  t,
}: {
  title: string
  description?: string
  t: any
}) => {
  return (
    <div
      className={`w-auto bg-white shadow-lg rounded-xl p-4 border-l-4 border-teal-400 ${
        t.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="h-5 w-5 text-teal-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-teal-700">{title}</h3>
            {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
          </div>
        </div>
        <button
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 rounded-full p-1 hover:bg-teal-50 transition-colors"
          onClick={() => toast.dismiss(t.id)}
        >
          <span className="sr-only">Close</span>
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Show Info Toast
export const showInfoToast = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => {
  toast.custom((t) => <InfoToastComponent t={t} title={title} description={description} />, {
    duration: 4000,
    position: "top-right",
  })
}

// Custom Toast with Animation
export const showCustomToast = ({
  title,
  description,
  icon,
  borderColor,
  titleColor,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  borderColor?: string
  titleColor?: string
}) => {
  toast.custom(
    (t) => (
      <div
        className={`w-auto bg-white shadow-lg rounded-xl p-4 ${
          borderColor ? `border-l-4 ${borderColor}` : "border-l-4 border-teal-500"
        } ${t.visible ? "animate-enter" : "animate-leave"}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
            <div className={icon ? "ml-3" : ""}>
              <h3 className={`text-sm font-medium ${titleColor || "text-teal-800"}`}>{title}</h3>
              {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
            </div>
          </div>
          <button
            className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-full p-1 hover:bg-teal-50 transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            <span className="sr-only">Close</span>
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    {
      duration: 4000,
      position: "top-right",
    },
  )
}
