import React, { useEffect } from "react";
import * as Midi from "@tonejs/midi";
import { Synth, start } from "tone";

const MidiPlayer = ({ blobURL }) => {
  useEffect(() => {
    const playMidi = async () => {
      console.log("blobURL", blobURL);
      const response = await fetch(blobURL);
      const arrayBuffer = await response.arrayBuffer();
      const midi = new Midi.Midi(arrayBuffer);

      // Ensure the audio context is started
      await start();

      const synth = new Synth().toDestination();

      midi.tracks.forEach((track) => {
        track.notes.forEach((note) => {
          synth.triggerAttackRelease(note.name, note.duration, note.time);
        });
      });
    };

    playMidi();
  }, [blobURL]);

  return (
    <div
      style={{
        fontFamily: "pixelGraphic",
        fontSize: "20px",
        paddingTop: "20px",
      }}
    >
      {/* Playing MIDI from: {blobURL} */}
    </div>
  );
};

export default MidiPlayer;
