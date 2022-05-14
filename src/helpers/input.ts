export const handleGracefulExit = () => {
  console.log('\nInterrupt signal detected! Closing gracefully...');
  process.exit();
};
