import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  onPreview: () => void;
  isSubmitDisabled: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onPreview,
  isSubmitDisabled
}) => {
  return (
    <div className="flex-none flex justify-between p-4 bg-white border-t">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-gray-700 hover:text-gray-900"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onPreview}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitDisabled}
      >
        Preview
      </button>
    </div>
  );
};

export default FormActions;