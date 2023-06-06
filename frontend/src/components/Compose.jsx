export function Compose() {
  return (
    <form onSubmit={addThought}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="4"
        placeholder="Write your thought here..."
      ></textarea>
      <button type="submit">Save</button>
    </form>
  );
}