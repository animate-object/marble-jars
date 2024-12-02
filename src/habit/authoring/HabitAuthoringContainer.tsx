import { useCallback, useContext, useState } from "react";
import { FormContent, FormLayout } from "./FormLayout";
import { Button, Select, Textarea } from "react-daisyui";
import { HabitContext } from "../HabitContext";
import { AppContext } from "../../AppState.context";

type HabitDraft = Partial<HabitDefinition>;

interface HabitAuthoringState {
  currentStage: "schedule" | "action" | "duration" | "finalize";
  habitDraft: HabitDraft;
}

interface FormStageProps {
  draft: HabitDraft;
  onUpdateDraft: (draft: HabitDraft) => void;
}

type FormStageRender = (props: FormStageProps) => React.ReactNode;

const ActionStage: FormStageRender = ({
  onUpdateDraft,
  draft,
}: FormStageProps) => {
  return (
    <FormContent
      explanation={
        <div className="text-lg">
          <b>Describe the action of your habit.</b> This should be a statement
          starting with <i>I&nbsp;will...</i>, for&nbsp;example:
          <ul className="list-disc list-inside">
            <li>I will empty the dishwasher</li>
            <li>I will do some push ups</li>
          </ul>
        </div>
      }
    >
      <Textarea
        className="resize-none w-full min-h-32 text-lg"
        value={draft.action ?? ""}
        onChange={(evt) => {
          onUpdateDraft({
            action: evt.currentTarget.value,
          });
        }}
      />
    </FormContent>
  );
};

const ScheduleStage: FormStageRender = ({
  onUpdateDraft,
  draft,
}: FormStageProps) => {
  return (
    <FormContent
      explanation={
        <div className="text-lg">
          <b>Describe the trigger for this habit.</b> Habit triggers are
          specific events that will prompt you to perform the habit. The best
          triggers are specific and easy to recognize.
          <br />
          <br /> Your trigger should start with <i>After I</i> or <i>When I</i>,
          for example:
          <br />
          <br />
          <ul className="list-disc list-inside">
            <li>After I brush my teeth</li>
            <li>When I wake up in the morning</li>
            <li>When I feel like smoking a cigarette</li>
          </ul>
        </div>
      }
    >
      <Textarea
        className="resize-none w-full min-h-32 text-lg"
        value={draft.schedule?.trigger ?? ""}
        onChange={(evt) => {
          onUpdateDraft({
            ...draft,
            schedule: {
              kind: "trigger",
              trigger: evt.currentTarget.value,
            },
          });
        }}
      />
    </FormContent>
  );
};

const DurationStage: FormStageRender = ({
  onUpdateDraft,
  draft,
}: FormStageProps) => {
  const options = [25, 50, 100, 150, 200, 250, 500, 1000];
  return (
    <FormContent
      explanation={
        <div className="text-lg">
          To build a habit, you must repeat it many times. We suggest a minimum
          of 30 repetitions, but you can choose more if you like up to 1000.
        </div>
      }
    >
      <Select
        className="w-full text-lg"
        value={draft.duration ?? ""}
        onChange={(evt) => {
          onUpdateDraft({
            duration: parseInt(evt.currentTarget.value),
          });
        }}
      >
        <Select.Option value="">Select a duration</Select.Option>
        {options.map((option) => (
          <Select.Option key={option} value={option}>
            {option}
          </Select.Option>
        ))}
      </Select>
    </FormContent>
  );
};

const FinalizeStage: FormStageRender = ({ draft }: FormStageProps) => {
  return (
    <FormContent
      explanation={
        <div className="text-lg">
          Let's put it all together. Here's how you defined your habit:
        </div>
      }
    >
      <div className="flex flex-col justify-center items-evenly text-center">
        <div className="text-lg italic">{draft.schedule?.trigger}</div>
        <div>...</div>
        <div className="text-lg italic">{draft.action}</div>
        <div>...</div>
        <div className="text-lg">
          To be repeated <span className="italic">{draft.duration}</span> times
        </div>
      </div>
    </FormContent>
  );
};

interface AuthoringStageDef {
  stage: "action" | "schedule" | "duration" | "finalize";
  render: FormStageRender;
  validWhen: (draft: HabitDraft) => boolean;
  nextStage?: "action" | "schedule" | "duration" | "finalize";
  onBack?: (state: HabitAuthoringState) => HabitAuthoringState;
}

const AUTHORING_STAGES: AuthoringStageDef[] = [
  {
    stage: "action",
    render: ActionStage,
    nextStage: "schedule",
    validWhen: (draft) => !!draft.action,
  },
  {
    stage: "schedule",
    render: ScheduleStage,
    validWhen: (draft) => !!draft.schedule,
    nextStage: "duration",
    onBack: (state) => ({
      ...state,
      currentStage: "action",
      habitDraft: {
        ...state.habitDraft,
        schedule: undefined,
      },
    }),
  },
  {
    stage: "duration",
    render: DurationStage,
    validWhen: (draft) => !!draft.duration,
    nextStage: "finalize",
    onBack: (state) => ({
      ...state,
      currentStage: "schedule",
      habitDraft: {
        ...state.habitDraft,
        duration: undefined,
      },
    }),
  },
  {
    stage: "finalize",
    render: FinalizeStage,
    validWhen: (draft) => !!draft.duration,
    onBack: (state) => ({
      ...state,
      currentStage: "duration",
      habitDraft: {
        ...state.habitDraft,
        duration: undefined,
      },
    }),
  },
];

export const HabitAuthoringContainer = () => {
  const habitStore = useContext(HabitContext);
  const app = useContext(AppContext);
  const [state, setState] = useState<HabitAuthoringState>({
    currentStage: "action",
    habitDraft: { duration: 50 },
  });

  const updateHabitDraft = useCallback(
    (draft: HabitDraft) => {
      setState({ ...state, habitDraft: { ...state.habitDraft, ...draft } });
    },
    [state, setState]
  );

  const stage = AUTHORING_STAGES.find(
    (stageDef) => stageDef.stage === state.currentStage
  );

  const saveHabit = useCallback(() => {
    habitStore.createNewHabit(state.habitDraft as HabitDefinition);
    app.setActiveView("habit-list");
  }, [habitStore, state.habitDraft]);

  return (
    <>
      <FormLayout>
        {stage?.render({
          draft: state.habitDraft,
          onUpdateDraft: updateHabitDraft,
        })}
        <div className="flex justify-evenly">
          {
            <Button
              variant="outline"
              color="neutral"
              onClick={() => {
                if (stage?.onBack) {
                  setState(stage.onBack(state));
                } else {
                  app.setActiveView("habit-list");
                }
              }}
            >
              &lt; Back
            </Button>
          }
          {state.currentStage !== "finalize" && (
            <Button
              variant="outline"
              color="primary"
              disabled={!stage?.validWhen(state.habitDraft)}
              onClick={() => {
                if (stage?.nextStage) {
                  setState({
                    currentStage: stage.nextStage,
                    habitDraft: state.habitDraft,
                  });
                }
              }}
            >
              Next &gt;
            </Button>
          )}
          {state.currentStage === "finalize" && (
            <Button
              variant="outline"
              color="success"
              onClick={() => {
                saveHabit();
              }}
            >
              Save Habit
            </Button>
          )}
        </div>
      </FormLayout>
    </>
  );
};