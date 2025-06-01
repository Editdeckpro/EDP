import React from "react";

export default function SubscriptionHistory() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Subscription History</h3>
      <div className="rounded-xl overflow-hidden border">
        <table className="w-full">
          <thead className="bg-white rounded-lg border-b border-[#dedede]">
            <tr>
              <th className="text-left py-4 px-6 font-semibold">Plan Name</th>
              <th className="text-left py-4 px-6 font-semibold">Plan Price</th>
              <th className="text-left py-4 px-6 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, index) => (
              <tr
                key={index}
                className="border-b border-[#dedede] last:border-0"
              >
                <td className="py-4 px-6 text-[#6a6c7b]">Basic Plan</td>
                <td className="py-4 px-6 text-[#6a6c7b]">$15</td>
                <td className="py-4 px-6 text-[#6a6c7b]">11th March, 2024</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
