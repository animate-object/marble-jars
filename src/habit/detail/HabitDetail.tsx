import { useCallback, useContext, useRef, useState } from "react";
import { Button, Modal, Navbar } from "react-daisyui";
import { HabitContext } from "../HabitContext";
import { AppNavBar } from "../../layout/AppNavBar";
import { HabitColors } from "../color";
import { JarOfMarblesDetail } from "./grid/JarOfMarblesDetail";

const DetailNav = ({
  onBack,
  onDelete,
}: {
  onBack: VoidFunction;
  onDelete: VoidFunction;
}) => {
  return (
    <AppNavBar>
      <Navbar.Start>
        <Button variant="outline" color="neutral" size="sm" onClick={onBack}>
          &lt; Back
        </Button>
      </Navbar.Start>
      <Navbar.End>
        <Button variant="outline" color="error" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </Navbar.End>
    </AppNavBar>
  );
};

interface HabitDetailProps {
  habit: Habit;
  onTrack: VoidFunction;
}
export const HabitDetail = ({ habit, onTrack }: HabitDetailProps) => {
  const [didJustTrack, setDidJustTrack] = useState(false);
  const habitComplete = habit.progress >= habit.definition.duration;
  const { color } = habit.definition;

  const canTrack = !habitComplete && !didJustTrack;

  const handleTrackhabit = useCallback(() => {
    onTrack();
    setDidJustTrack(true);
  }, [onTrack, setDidJustTrack]);

  return (
    <div className="flex flex-col h-full items-center justify-evenly p-4 gap-4">
      <div>
        <div className="text-center mb-8">
          <div className="text-2xl font-light">
            {habit.definition.schedule.trigger}
          </div>
          <div className={`text-2xl italic ${HabitColors.base(color)}`}>
            {habit.definition.action}
          </div>
        </div>
        <JarOfMarblesDetail habit={habit} />
      </div>

      {canTrack && (
        <Button color="success" onClick={handleTrackhabit}>
          Track Habit
        </Button>
      )}
      {habitComplete && (
        <div className={`h-12 italic ${HabitColors.base(color)}`}>
          The jar is full! Habit complete.
        </div>
      )}
      {didJustTrack && (
        <div className={`h-12 italic ${HabitColors.base(color)}`}>
          Another marble in the jar.
        </div>
      )}
    </div>
  );
};

export const HabitDetailContainer = () => {
  const habitStore = useContext(HabitContext);
  const modalRef = useRef<HTMLDialogElement>(null);

  const selectedHabit = habitStore.selectedHabit;
  if (!selectedHabit) {
    return <div>No habit selected</div>;
  }

  return (
    <>
      <DetailNav
        onBack={habitStore.clearSelectedHabit}
        onDelete={() => modalRef?.current?.showModal()}
      />
      {selectedHabit && (
        <HabitDetail
          habit={selectedHabit}
          onTrack={() => {
            habitStore.trackHabitProgress(selectedHabit.id);
          }}
        />
      )}
      {!selectedHabit && <div>No habit selected</div>}
      <Modal ref={modalRef}>
        <Modal.Header>Delete Habit?</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this habit?</p>
        </Modal.Body>
        <Modal.Actions>
          <Button
            variant="outline"
            color="neutral"
            size="sm"
            onClick={() => {
              modalRef?.current?.close();
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            size="sm"
            onClick={() => {
              habitStore.deleteHabit(selectedHabit.id);
              habitStore.clearSelectedHabit();
              modalRef?.current?.close();
            }}
          >
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
