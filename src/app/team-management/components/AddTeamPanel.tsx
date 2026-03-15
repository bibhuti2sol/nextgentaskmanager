// Updated button styles in Add New Team panel to match Edit Task panel
<div className="flex justify-end gap-2">
  <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
  >
    Cancel
  </button>
  <button
    type="submit"
    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90 transition"
  >
    Add Team
  </button>
</div>