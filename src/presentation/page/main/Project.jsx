import React, { useEffect } from "react";
import { projectState, loadingState, errorState } from "state/project";
import { useRecoilState } from "recoil";
import styled from "./styled";
import API from "data/http/axios/api";
import UserImg from "assets/profile.png";
import fieldMelody from "assets/fieldMelody.png";
import fieldInstrument from "assets/fieldInstrument.png";
import fieldLyric from "assets/fieldLyric.png";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Icon } from "@iconify/react";
import playCircle from "@iconify-icons/mdi/play-circle";
import pauseCircle from "@iconify-icons/mdi/pause-circle";
import useLastLocationHistory from "lib/history";
import Color from "utils/style/color";

function Project() {
  const setHistory = useLastLocationHistory();
  const [projects, setProjects] = useRecoilState(projectState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [error, setError] = useRecoilState(errorState);

  useEffect(() => {
    const readRequestProjects = async () => {
      try {
        setError(null);
        setProjects(null);
        setLoading(true);
        const {
          data: { maininfo: array },
        } = await API.get("/requestprojects");
        setProjects(array);
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false);
    };

    readRequestProjects();
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!projects) return null;
  console.log(projects);
  console.log(projects[0].instrument_field);
  return (
    <>
      {projects.map((project) => (
        <styled.ProjectBox>
          <styled.Project>
            <div
              onClick={() => {
                setHistory("/requestprojects/" + project.id);
              }}
            >
              <styled.ProjectUserId key={project.id}>
                <styled.ProjectUserImg src={UserImg}></styled.ProjectUserImg>{" "}
                {project.User.email}
              </styled.ProjectUserId>
              <styled.ProjectTitle>{project.title}</styled.ProjectTitle>
              <styled.ProjectField>
                {project.music_field === true ? (
                  <styled.FieldMelody src={fieldMelody}></styled.FieldMelody>
                ) : null}
                {project.instrument_field === true ? (
                  <styled.FieldInstrument
                    src={fieldInstrument}
                  ></styled.FieldInstrument>
                ) : null}
                {project.lyrics_field === true ? (
                  <styled.FieldLyric src={fieldLyric}></styled.FieldLyric>
                ) : null}
              </styled.ProjectField>
              <styled.GenreMood>
                <styled.Genre>장르</styled.Genre>
                <styled.GenreContext>{project.genre}</styled.GenreContext>
                <styled.Mood>분위기</styled.Mood>
                <styled.MoodContext>{project.mood}</styled.MoodContext>
              </styled.GenreMood>
            </div>
            {project.audioFile ? (
              <AudioPlayer
                style={{
                  position: "relative",
                  right: "20px",
                  width: "350px",
                  display: "flex",
                  justifyContent: "flex-start",
                  boxShadow: "none",
                  marginTop: "20px",
                  zIndex: "-1",
                  opacity: "1",
                  backgroundColor: "inherit",
                }}
                src={project.audioFile}
                showJumpControls={false}
                customVolumeControls={[]}
                customAdditionalControls={[]}
                defaultCurrentTime="Loading"
                defaultDuration="Loading"
                layout="horizontal-reverse"
                customProgressBarSection={[
                  RHAP_UI.PROGRESS_BAR,
                  RHAP_UI.CURRENT_LEFT_TIME,
                ]}
                customIcons={{
                  play: <Icon icon={playCircle} color={Color.MAIN_COLOR} />,
                  pause: <Icon icon={pauseCircle} color={Color.MAIN_COLOR} />,
                }}
              ></AudioPlayer>
            ) : undefined}{" "}
            {project.lyrics_text ? (
              <styled.LyricText>{project.lyrics_text}</styled.LyricText>
            ) : undefined}
          </styled.Project>
        </styled.ProjectBox>
      ))}
    </>
  );
}

export default Project;
