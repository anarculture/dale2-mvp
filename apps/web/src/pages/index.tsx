import { Button } from '@dale/ui';

export default function Web() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Dale Web</h1>
      <div className="mt-4">
        <Button onPress={() => alert('Button clicked!')} text="Shared Button" />
      </div>
    </div>
  );
}
