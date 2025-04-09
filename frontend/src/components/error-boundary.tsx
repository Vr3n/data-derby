function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="p-4 text-red-600 bg-red-100 rounded">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p>{error.message}</p>
    </div>
  );
}

export default ErrorComponent;
