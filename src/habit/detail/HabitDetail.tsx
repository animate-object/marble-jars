import { useContext, useRef, useState } from "react";
import { Button, Modal, Navbar } from "react-daisyui";
import { HabitContext } from "../HabitContext";
import { AppNavBar } from "../../layout/AppNavBar";

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
        <Button color="secondary" size="sm" onClick={onBack}>
          &lt; Back
        </Button>
      </Navbar.Start>
      <Navbar.End>
        <Button color="error" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </Navbar.End>
    </AppNavBar>
  );
};

interface HabitDetailProps {
  habit: Habit;
}
export const HabitDetail = ({ habit }: HabitDetailProps) => {
  return <div>Placeholder for {habit.definition.action}</div>;
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
      {selectedHabit && <HabitDetail habit={selectedHabit} />}
      {!selectedHabit && <div>No habit selected</div>}
      <Modal ref={modalRef}>
        <Modal.Header>Delete Habit?</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this habit?</p>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              modalRef?.current?.close();
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
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
