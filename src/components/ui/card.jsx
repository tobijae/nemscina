// src/components/ui/card.jsx
export const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  );
  
  export const CardContent = ({ children, className = "" }) => (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
  
  // src/components/ui/button.jsx
  export const Button = ({ children, className = "", ...props }) => (
    <button 
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
  
  // src/components/ui/input.jsx
  export const Input = ({ className = "", ...props }) => (
    <input
      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );