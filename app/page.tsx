'use client'

import { useState, useMemo } from 'react'
import { z } from 'zod'

/** Validation schema of a meeting participant. */
const addParticipantSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .nonempty({
      message: 'Name is required',
    }),
  salary: z
    .number({
      required_error: 'Salary is required',
    })
    .nonnegative({
      message: 'Salary must be a positive number',
    })
    .min(1, {
      message: 'Salary must be > 0',
    }),
})

type Participant = z.infer<typeof addParticipantSchema>

/** Converts numbers to currency */
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function Home() {
  const [newParticipant, setNewParticipant] = useState<Participant>({
    name: '',
    salary: 0,
  })
  const [participants, setParticipants] = useState<Participant[]>([])
  const [duration, setDuration] = useState(60)
  const [formErrors, setFormErrors] = useState<string[]>([])

  const salaryTotal = useMemo(
    () =>
      formatter.format(
        participants.reduce((acc, participant) => acc + participant.salary, 0)
      ),
    [participants]
  )

  const meetingCost = useMemo(
    () =>
      formatter.format(
        participants.reduce(
          (acc, participant) =>
            acc + (participant.salary / 52 / 40 / 60) * duration,
          0
        )
      ),
    [participants, duration]
  )

  function addParticipant() {
    // validate the new participant
    const result = addParticipantSchema.safeParse(newParticipant)

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message)
      setFormErrors(errors)
      return
    }

    setParticipants([...participants, result.data])
    setNewParticipant({ name: '', salary: 0 })
  }

  return (
    <main className="flex flex-col items-center min-h-screen gap-6 p-24">
      <div id="container" className="w-full max-w-5xl font-mono text-sm">
        <section id="heading" className="mb-10">
          <h1 className="text-6xl font-bold leading-7 text-white">
            Meeting Cost Calculator
          </h1>
        </section>
        <section className="bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="py-10 bg-gray-900">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="pb-6 border-b border-white/10">
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Meeting Duration (minutes)
                  </label>
                  <div className="max-w-xs mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <input
                        type="text"
                        name="duration"
                        id="duration"
                        autoComplete="duration"
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h2 className="text-base font-semibold leading-6 text-white">
                      Meeting Participants
                    </h2>
                  </div>
                </div>
                <div className="flow-root mt-8">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                            >
                              Salary
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                            >
                              Meeting Cost
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {participants.map((participant, index) => (
                            <tr
                              key={`${participant.name}_${participant.salary}_${index}`}
                            >
                              <td className="py-4 pl-4 pr-3 text-sm font-medium text-white whitespace-nowrap sm:pl-0">
                                {participant.name}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-300 whitespace-nowrap">
                                {formatter.format(participant.salary)}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-300 whitespace-nowrap">
                                {formatter.format(
                                  (participant.salary / 52 / 40 / 60) * duration
                                )}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-300 whitespace-nowrap">
                                <button
                                  type="button"
                                  className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                  onClick={() =>
                                    setParticipants(
                                      participants.filter((_, i) => i !== index)
                                    )
                                  }
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-700">
                            <td className="py-2 pr-3 text-sm font-bold text-white whitespace-nowrap">
                              Total
                            </td>
                            <td className="px-3 py-2 text-sm font-bold text-gray-300 whitespace-nowrap">
                              {salaryTotal}
                            </td>
                            <td className="px-3 py-2 text-sm font-bold text-gray-300 whitespace-nowrap">
                              {meetingCost}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-300 whitespace-nowrap"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="form" className="">
          <div className="px-6 pt-6 pb-12 bg-gray-800 border-b border-white/10">
            <h2 className="text-base font-semibold leading-7 text-white">
              Add Meeting Participant
            </h2>

            <div className="grid grid-cols-1 mt-5 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="participant-name"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Participant Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="participant-name"
                    autoComplete="participant-name"
                    className="block w-full rounded-md border-0 bg-white/5 pl-1 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setNewParticipant({
                        ...newParticipant,
                        name: e.target.value,
                      })
                    }
                    value={newParticipant.name}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Salary (per year)
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="salary"
                    id="salary"
                    autoComplete="salary"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-1 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setNewParticipant({
                        ...newParticipant,
                        salary: Number(e.target.value),
                      })
                    }
                    value={newParticipant.salary}
                  />
                </div>
              </div>
              {formErrors && (
                <div className="col-span-1 sm:col-span-6">
                  {formErrors.map((error, index) => (
                    <p key={index} className="text-sm text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
              )}
              <div className="col-span-1 sm:col-span-6">
                <button
                  type="submit"
                  className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={addParticipant}
                >
                  Add Participant
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
