document.getElementById("copyHelp").addEventListener("click", async () => {
  try {
    const response = await fetch("/assets/misc/under-the-hood.txt");
    const rawMarkdown = await response.text();
    await navigator.clipboard.writeText(rawMarkdown);
    alert("Help File copied to clipboard!");
  } catch (err) {
    console.error("Copy failed:", err);
    alert("Could not copy. Please try again.");
  }
});